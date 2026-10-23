(() => {
    if (window.__aiFetchTrackerInstalled) return;

    const MAX_ACTIVITY_ENTRIES = 40;
    const MAX_RESPONSE_BYTES = 2400;
    const ACTIVITY_STORAGE_KEY = 'clasesParticularesAiActivity';
    const SENSITIVE_KEY_PATTERN = /password|pass(word)?|contrase|clave|token|secret|authorization|api.?key|session|cookie|user.?id|username|account|cuenta|correo|e.?mail|phone|telefono|nombre|apellido|full.?name|first.?name|last.?name|address|direccion|dni|document|cuil|card|tarjeta|cvv|saldo|deuda|qr|payment|pago|monto|amount|price|precio|importe|comment|comentario|mensaje|observacion|nota/i;
    let savedEvents = [];
    try {
        const savedActivity = sessionStorage.getItem(ACTIVITY_STORAGE_KEY);
        if (savedActivity) {
            const parsedActivity = JSON.parse(savedActivity);
            if (Array.isArray(parsedActivity)) savedEvents = parsedActivity.slice(-MAX_ACTIVITY_ENTRIES);
        }
    } catch (error) {
        console.warn('No se pudo recuperar el registro previo de peticiones fetch.', error);
    }
    const events = savedEvents;
    const originalFetch = window.fetch;
    let nextRequestId = 0;

    function sanitizeText(value) {
        return String(value)
            .replace(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi, '[correo redactado]')
            .replace(/\bBearer\s+\S+/gi, '[credencial redactada]')
            .replace(/([?&][^=&#\s]+=)[^&#\s]*/g, '$1[valor redactado]')
            .replace(/(?<!\w)\+?\d[\d\s().-]{7,}\d(?!\w)/g, '[número redactado]')
            .slice(0, MAX_RESPONSE_BYTES);
    }

    function sanitizeData(value, key = '') {
        if (key && SENSITIVE_KEY_PATTERN.test(key)) return '[dato sensible redactado]';
        if (typeof value === 'string') return sanitizeText(value);
        if (Array.isArray(value)) return value.slice(0, 30).map((item) => sanitizeData(item));
        if (value && typeof value === 'object') {
            return Object.fromEntries(
                Object.entries(value).slice(0, 50).map(([entryKey, entryValue]) => [
                    entryKey,
                    sanitizeData(entryValue, entryKey)
                ])
            );
        }
        return value;
    }

    function getTarget(value) {
        try {
            const url = new URL(value, window.location.href);
            return url.origin === window.location.origin
                ? url.pathname
                : `${url.hostname}${url.pathname}`;
        } catch (error) {
            return '[destino no disponible]';
        }
    }

    function record(entry) {
        const safeEntry = {
            time: new Date().toISOString(),
            page: window.location.pathname,
            ...sanitizeData(entry)
        };
        events.push(safeEntry);
        if (events.length > MAX_ACTIVITY_ENTRIES) events.shift();

        try {
            sessionStorage.setItem(ACTIVITY_STORAGE_KEY, JSON.stringify(events));
        } catch (error) {
            console.warn('No se pudo guardar el registro de peticiones fetch.', error);
        }

        if (typeof window.__aiRecordFetchActivity === 'function') {
            window.__aiRecordFetchActivity(safeEntry);
        }
        return safeEntry;
    }

    async function readResponse(response) {
        if (response.type === 'opaque') {
            return '[respuesta opaca: no-cors no permite leer el estado ni el cuerpo]';
        }

        const contentType = response.headers.get('content-type') || '';
        if (/image\/|audio\/|video\/|font\/|application\/(?:octet-stream|pdf|zip|gzip)/i.test(contentType)) {
            return `[cuerpo omitido: ${contentType || 'tipo binario'}]`;
        }
        if (!response.body) return '[respuesta sin cuerpo]';

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let body = '';
        let bytesRead = 0;
        let truncated = false;

        try {
            while (bytesRead < MAX_RESPONSE_BYTES) {
                const { done, value } = await reader.read();
                if (done) break;
                const chunk = value.subarray(0, MAX_RESPONSE_BYTES - bytesRead);
                bytesRead += chunk.byteLength;
                body += decoder.decode(chunk, { stream: true });
                if (chunk.byteLength < value.byteLength) {
                    truncated = true;
                    await reader.cancel();
                    break;
                }
            }
            body += decoder.decode();
            if (bytesRead >= MAX_RESPONSE_BYTES) truncated = true;
        } catch (error) {
            return '[no se pudo leer el cuerpo de la respuesta]';
        }

        let sanitized;
        try {
            sanitized = sanitizeData(JSON.parse(body));
            sanitized = JSON.stringify(sanitized);
        } catch (error) {
            sanitized = sanitizeText(body);
        }

        return truncated ? `${sanitized.slice(0, MAX_RESPONSE_BYTES)} [respuesta truncada]` : sanitized;
    }

    if (typeof originalFetch === 'function') {
        const trackedFetch = async function(input, init) {
            const request = input instanceof Request ? input : null;
            const url = request?.url || String(input);
            const method = (init?.method || request?.method || 'GET').toUpperCase();
            const target = getTarget(url);
            const requestId = ++nextRequestId;
            const requestEntry = record({ type: 'request', requestId, method, path: target });
            console.info('[Petición fetch]', JSON.stringify(requestEntry));

            try {
                const response = await Reflect.apply(originalFetch, this, arguments);
                void readResponse(response.clone()).then((body) => {
                    const responseEntry = record({
                        type: 'response',
                        requestId,
                        method,
                        path: target,
                        status: response.type === 'opaque' ? 'opaque' : response.status,
                        ok: response.type === 'opaque' ? null : response.ok,
                        body
                    });
                    console.info('[Resultado fetch]', JSON.stringify(responseEntry));
                }).catch((error) => {
                    console.warn('No se pudo registrar el cuerpo de una respuesta fetch.', error);
                });
                return response;
            } catch (error) {
                const errorEntry = record({
                    type: 'request-error',
                    requestId,
                    method,
                    path: target,
                    error: sanitizeText(error.message || 'Error de red sin detalle')
                });
                console.info('[Resultado fetch]', JSON.stringify(errorEntry));
                throw error;
            }
        };
        trackedFetch.__aiActivityTracked = true;
        window.fetch = trackedFetch;
    }

    window.__aiFetchTrackerInstalled = true;
    window.__aiFetchActivity = events;
})();
