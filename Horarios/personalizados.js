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
        habilitadas: [
            { semana: 0, celda: "C5" },   // Semana actual - Viernes 15:00 → libre
            { semana: 0, celda: "C6" },   // Semana actual - Viernes 16:00 → lib
            { semana: 0, celda: "C7" },   // Semana actual - Viernes 17:00 → libre
            { semana: 0, celda: "C8" },   // Semana actual - Viernes 18:00 → libre
            { semana: 0, celda: "C9" },   // Semana actual - Viernes 19:00 → libre  
            { semana: 0, celda: "C10" },   // Próxima semana - Viernes 15:00 → libre
            { semana: 0, celda: "C11" },   // Próxima semana - Viernes 16:00 → libre
        ],
        deshabilitadas: []
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