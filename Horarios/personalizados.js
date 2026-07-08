/**
 * personalizados.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Horarios personalizados por alumno.
 *
 * Cada entrada usa el correo del alumno como clave.
 * Las listas "habilitadas" y "deshabilitadas" son arrays de objetos con:
 *   - semana: 0 (semana actual) o 1 (próxima semana)
 *   - celda:  LetraColumna + NúmeroFila  (ej: "D9", "B7")
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
 * Para agregar un alumno nuevo simplemente copiá un bloque y cambiá el correo
 * y los arrays.
 * ─────────────────────────────────────────────────────────────────────────────
 */

const HORARIOS_PERSONALIZADOS = {

    "ccamilavilla@gmail.com": {
        habilitadas: [],
        deshabilitadas: [
            { semana: 1, celda: "B5" },
            { semana: 1, celda: "B6" },
            { semana: 1, celda: "B7" },
            { semana: 1, celda: "D11" },
            { semana: 1, celda: "D12" },
            { semana: 1, celda: "D13" },
            { semana: 1, celda: "F8" },
            { semana: 1, celda: "F9" }, 
        ]
    },
    "suaffine@gmail.com": {
        habilitadas: [],
        deshabilitadas: [
        { semana: 1, celda: "C3" },
        { semana: 1, celda: "C4" },
        { semana: 1, celda: "C5" },
        { semana: 1, celda: "C6" },
        { semana: 1, celda: "C7" },
        { semana: 1, celda: "F7" },
        { semana: 1, celda: "F8" },
        { semana: 1, celda: "F9" },
        { semana: 1, celda: "E12" },
        ]
    },
    
    "mailinquiroz.05@gmail.com": {
        habilitadas: [],
        deshabilitadas: [
        { semana: 1, celda: "C3" },
        { semana: 1, celda: "C4" },
        { semana: 1, celda: "C5" },
        { semana: 1, celda: "C6" },
        { semana: 1, celda: "C7" },
        { semana: 1, celda: "F7" },
        { semana: 1, celda: "F8" },
        { semana: 1, celda: "F9" },
        { semana: 1, celda: "E12" },
        { semana: 1, celda: "E13" },
        ]
    },
    "mirko.scharfspitz@gmail.com": {
        habilitadas: [],
        deshabilitadas: [
        { semana: 1, celda: "E3" },
        { semana: 1, celda: "E4" },
        { semana: 1, celda: "E5" },
        { semana: 1, celda: "E6" },
        { semana: 1, celda: "E7" },
        { semana: 1, celda: "E8" },
        { semana: 1, celda: "E9" },
        { semana: 1, celda: "E10" },
        { semana: 1, celda: "E11" },
        { semana: 1, celda: "E12" },
        { semana: 1, celda: "E13" },
        { semana: 1, celda: "F3" },
        { semana: 1, celda: "F4" },
        { semana: 1, celda: "F5" },
        { semana: 1, celda: "F6" },
        { semana: 1, celda: "F7" },
        { semana: 1, celda: "F8" },
        { semana: 1, celda: "F9" },
        { semana: 1, celda: "F10" },
        { semana: 1, celda: "F11" },
        { semana: 1, celda: "F12" },
        { semana: 1, celda: "F13" },
   
        ]
    },
    "matisoldini1@gmail.com": {
        habilitadas: [],
        deshabilitadas: [
        { semana: 1, celda: "E3" },
        { semana: 1, celda: "E4" },
        { semana: 1, celda: "E5" },
        { semana: 1, celda: "E6" },
        { semana: 1, celda: "E7" },
        { semana: 1, celda: "E8" },
        { semana: 1, celda: "E9" },
        { semana: 1, celda: "E10" },
        { semana: 1, celda: "E11" },
        { semana: 1, celda: "E12" },
        { semana: 1, celda: "E13" },
        { semana: 1, celda: "F3" },
        { semana: 1, celda: "F4" },
        { semana: 1, celda: "F5" },
        { semana: 1, celda: "F6" },
        { semana: 1, celda: "F7" },
        { semana: 1, celda: "F8" },
        { semana: 1, celda: "F9" },
        { semana: 1, celda: "F10" },
        { semana: 1, celda: "F11" },
        { semana: 1, celda: "F12" },
        { semana: 1, celda: "F13" },
   
        ]
    },
    "juanma.2000@hotmail.com": {
        habilitadas: [
            { semana: 0, celda: "F11" },
            { semana: 0, celda: "F12" },
            { semana: 0, celda: "F13" },
            { semana: 0, celda: "F5" },
            { semana: 0, celda: "F6" },
   
        ],
        deshabilitadas: [
            
        ]
    },
    "bautistaclaret10@gmail.com": {
        
        habilitadas: [],
        deshabilitadas: [
        { semana: 1, celda: "E3" },
        { semana: 1, celda: "E4" },
        { semana: 1, celda: "E5" },
        { semana: 1, celda: "E6" },
        { semana: 1, celda: "E7" },
        { semana: 1, celda: "E8" },
        { semana: 1, celda: "E9" },
        { semana: 1, celda: "E10" },
        { semana: 1, celda: "E11" },
        { semana: 1, celda: "E12" },
        { semana: 1, celda: "E13" },
        { semana: 1, celda: "F3" },
        { semana: 1, celda: "F4" },
        { semana: 1, celda: "F5" },
        { semana: 1, celda: "F6" },
        { semana: 1, celda: "F7" },
        { semana: 1, celda: "F8" },
        { semana: 1, celda: "F9" },
        { semana: 1, celda: "F10" },
        { semana: 1, celda: "F11" },
        { semana: 1, celda: "F12" },
        { semana: 1, celda: "F13" },
   
        ]
    },
    // ── Podés agregar más alumnos debajo ──────────────────────────────────────
    // "otro.alumno@gmail.com": {
    //     habilitadas: [
    //         { semana: 1, celda: "C9" },   // Próxima semana - Martes 14:00 → libre
    //     ],
    //     deshabilitadas: [
    //         { semana: 0, celda: "E11" },  // Semana actual  - Jueves 16:00 → ocupado
    //         { semana: 1, celda: "E12" },  // Próxima semana - Jueves 17:00 → ocupado
    //     ]
    // },

};

/**
 * aplicarPersonalizados(correo, semana, celdasOcupadas)
 *
 * Recibe el correo del alumno, el índice de semana (0 o 1) y el array de
 * celdas ocupadas que devolvió la base de datos. Devuelve un nuevo array
 * con los overrides de esa semana aplicados.
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
            .map(e => e.celda);
        resultado = resultado.filter(celda => !celdas.includes(celda));
    }

    // 2. Forzar deshabilitadas → agregar al array si aún no están
    if (Array.isArray(config.deshabilitadas)) {
        const celdas = config.deshabilitadas
            .filter(e => e.semana === semana)
            .map(e => e.celda);
        for (const celda of celdas) {
            if (!resultado.includes(celda)) {
                resultado.push(celda);
            }
        }
    }

    return resultado;
}