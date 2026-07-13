/**
 * personalizados.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Horarios personalizados por alumno.
 *
 * Cada entrada usa el correo del alumno como clave.
 * Las listas "habilitadas" y "deshabilitadas" son arrays de objetos con:
 *   - semana: 0 (semana actual) o 1 (próxima semana)
 *   - celda:  LetraColumna + NúmeroFila  (ej: "D9", "B7")
 *             ó un RANGO "CeldaInicio:CeldaFin"  (ej: "B5:D12", "A1:A10")
 *
 * ┌─────────────┬───────────────────────────────────────────────────────────┐
 * │  Columnas   │  B = Lunes  C = Martes  D = Miércoles  E = Jueves        │
 * │             │  F = Viernes  G = Sábado  H = Domingo                    │
 * ├─────────────┼───────────────────────────────────────────────────────────┤
 * │  Filas      │  Fórmula: hora - 5  →  8 h = fila 3 … 19 h = fila 14    │
 * │             │  (la hora especial 8:15 usa la fila 3, igual que las 8)  │
 * └─────────────┴───────────────────────────────────────────────────────────┘
 *
 * habilitadas    → forzar DISPONIBLE aunque la BD diga que está ocupada.
 * deshabilitadas → forzar OCUPADA aunque la BD diga que está libre.
 *
 * RANGOS:
 *   En vez de escribir celda por celda, se puede escribir un rango con el
 *   formato "CeldaInicio:CeldaFin", por ejemplo:
 *     { semana: 0, celda: "B5:D12" }   →  equivale a TODAS las celdas del
 *                                          rectángulo B5, B6 ... D12
 *   Funciona con celdas sueltas y rangos mezclados en la misma lista, y no
 *   importa si el rango se escribe "B5:D12" o "D12:B5" (se ordena solo).
 *
 * Para agregar un alumno nuevo simplemente copiá un bloque y cambiá el correo
 * y los arrays.
 * ─────────────────────────────────────────────────────────────────────────────
 */

const HORARIOS_PERSONALIZADOS = {

    "ccamilavilla@gmail.com": {
        habilitadas: [
            { semana: 0, celda: "D3:D4" }
        ],
        deshabilitadas: []
    },
    "nicolastroncozo@gmail.com": {
        habilitadas: [],
        deshabilitadas: [
            { semana: 0, celda: "B3:F14" },
        ]
    },
    "suaffine@gmail.com": {
        habilitadas: [],
        deshabilitadas: [
            { semana: 0, celda: "B3:F14" },
        ]
    },

    "mailinquiroz.05@gmail.com": {
        habilitadas: [],
        deshabilitadas: [
            { semana: 0, celda: "C3:C7" },
            { semana: 0, celda: "F7:F9" },
            { semana: 0, celda: "E12:E13" },
        ]
    },
    "mirko.scharfspitz@gmail.com": {
        habilitadas: [
            // Habilita todo el rango B5:D12
            { semana: 0, celda: "B5:D12" },
        ],
        deshabilitadas: [
            { semana: 0, celda: "E3:F13" },
        ]
    },
    "matisoldini1@gmail.com": {
        habilitadas: [
            // Habilita todo el rango B5:D12
            { semana: 0, celda: "B5:D12" },
        ],
        deshabilitadas: [
            { semana: 0, celda: "E3:F13" },
        ]
    },
    "bautistaclaret10@gmail.com": {
        habilitadas: [
        ],
        deshabilitadas: [
                        { semana: 0, celda: "B3:F14" },

        ]
    },
    "pane.joaquin07@gmail.com": {
        habilitadas: [
        ],
        deshabilitadas: [
                        { semana: 0, celda: "B3:F14" },

        ]
    },

    "paulinalisvillanueva@gmail.com": {
        habilitadas: [
            { semana: 0, celda: "C3:D4" }
        ],
        deshabilitadas: []
    },
    // ── Podés agregar más alumnos debajo ──────────────────────────────────────
    // "otro.alumno@gmail.com": {
    //     habilitadas: [
    //         { semana: 0, celda: "C9" },       // Próxima semana - Martes 14:00 → libre
    //         { semana: 0, celda: "B5:D12" },   // ...o un rango completo
    //     ],
    //     deshabilitadas: [
    //         { semana: 0, celda: "E11" },      // Semana actual  - Jueves 16:00 → ocupado
    //         { semana: 0, celda: "E12" },      // Próxima semana - Jueves 17:00 → ocupado
    //     ]
    // },

};

/**
 * letraAIndice / indiceALetra
 * Conversión entre letra de columna ("A", "B", ...) e índice numérico (0, 1, ...).
 * Soporta A-Z (suficiente para este calendario, que usa B..H).
 */
function letraAIndice(letra) {
    return letra.toUpperCase().charCodeAt(0) - 65; // A=0, B=1, C=2...
}
function indiceALetra(indice) {
    return String.fromCharCode(65 + indice);
}

/**
 * expandirCelda(valor)
 *
 * Recibe el contenido del campo "celda" y devuelve SIEMPRE un array de
 * celdas individuales:
 *   - "D9"        → ["D9"]
 *   - "B5:D12"    → ["B5","B6",...,"D12"]  (todo el rectángulo)
 *
 * Si el formato no es válido, devuelve el valor original sin tocar (para no
 * romper nada silenciosamente) y avisa por consola.
 *
 * @param {string} valor
 * @returns {string[]}
 */
function expandirCelda(valor) {
    if (typeof valor !== "string") return [];

    // Celda suelta (sin ":") → se devuelve tal cual
    if (!valor.includes(":")) return [valor];

    const [inicio, fin] = valor.split(":");
    const patron = /^([A-Za-z]+)(\d+)$/;
    const matchInicio = inicio.match(patron);
    const matchFin = fin.match(patron);

    if (!matchInicio || !matchFin) {
        console.warn(`[personalizados.js] Rango inválido: "${valor}"`);
        return [valor];
    }

    const colInicio = letraAIndice(matchInicio[1]);
    const filaInicio = parseInt(matchInicio[2], 10);
    const colFin = letraAIndice(matchFin[1]);
    const filaFin = parseInt(matchFin[2], 10);

    const colMin = Math.min(colInicio, colFin);
    const colMax = Math.max(colInicio, colFin);
    const filaMin = Math.min(filaInicio, filaFin);
    const filaMax = Math.max(filaInicio, filaFin);

    const celdas = [];
    for (let c = colMin; c <= colMax; c++) {
        for (let f = filaMin; f <= filaMax; f++) {
            celdas.push(indiceALetra(c) + f);
        }
    }
    return celdas;
}

/**
 * aplicarPersonalizados(correo, semana, celdasOcupadas)
 *
 * Recibe el correo del alumno, el índice de semana (0 o 1) y el array de
 * celdas ocupadas que devolvió la base de datos. Devuelve un nuevo array
 * con los overrides de esa semana aplicados (soporta celdas sueltas y
 * rangos "A1:B5" en habilitadas/deshabilitadas).
 *
 * @param {string}   correo         – correo del alumno (Alumno.correoElectronico)
 * @param {number}   semana         – 0 = semana actual, 1 = próxima semana
 * @param {string[]} celdasOcupadas – array original de la BD, ej. ["B7","C9"]
 * @returns {string[]} nuevo array con los overrides aplicados
 */
function aplicarPersonalizados(correo, semana, celdasOcupadas) {
    const config = HORARIOS_PERSONALIZADOS[correo];
    if (!config) return celdasOcupadas;   // sin personalización → sin cambios

    let resultado = [...celdasOcupadas];

    // 1. Forzar habilitadas → quitar del array (no ocupadas)
    if (Array.isArray(config.habilitadas)) {
        const celdas = config.habilitadas
            .filter(e => e.semana === semana)
            .flatMap(e => expandirCelda(e.celda));
        resultado = resultado.filter(celda => !celdas.includes(celda));
    }

    // 2. Forzar deshabilitadas → agregar al array si aún no están
    if (Array.isArray(config.deshabilitadas)) {
        const celdas = config.deshabilitadas
            .filter(e => e.semana === semana)
            .flatMap(e => expandirCelda(e.celda));
        for (const celda of celdas) {
            if (!resultado.includes(celda)) {
                resultado.push(celda);
            }
        }
    }

    return resultado;
}