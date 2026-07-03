/**
 * ============================================================
 *  PERMISOS POR CONDICIÓN DE PAGO (Alumno.condicionPago)
 * ============================================================
 * Acá se define, para cada condición de pago, si cada permiso
 * está PERMITIDO (true) o RESTRINGIDO (false) para esos alumnos.
 *
 * Si una clave no aparece para una condición, significa "esa
 * condición no tiene excepción para ese permiso" y se usa el
 * valor global definido en permisos.js.
 *
 * Condiciones de pago que maneja el sistema:
 *   - "Normal"
 *   - "Regular"
 *   - "Deudor"
 *   - "Libre"
 *   - DEFAULT  -> se usa cuando Alumno.condicionPago no está
 *                 seteado o no coincide con ninguna de las
 *                 anteriores (alumno recién creado, dato vacío, etc).
 *
 * Para gestionar los permisos de "Deudor" o "Libre" que se
 * mencionaron, es acá donde hay que tocar.
 */

const PERMISOS_POR_CONDICION_PAGO = {

    Libre: {
        reservarSinAnticipacion12h: true,           // Libre no respeta el mínimo de 12hs de anticipación
        superarLimiteClasesImpagas: true,           // Libre no tiene límite de clases impagas
        reservarConDeudaDeDinero: true,             // Libre nunca se bloquea por deuda de dinero
        verAvisoInteresPorDeuda: false,              // Libre no ve el aviso de intereses por deuda
    },

    Deudor: {
        reservarConDeudaDeDinero: false,            // Deudor se bloquea si tiene dinero pendiente
    },

    Normal: {
        reservarConClasesPendientes: false,         // Normal se bloquea con 2+ clases pendientes de pago
    },

    Regular: {
        reservarConClasesPendientesAntiguas: false, // Regular se bloquea con 2+ clases pendientes de más de una semana
    },

    // Alumnos sin condición de pago asignada, o con un valor que no
    // coincide con ninguna de las anteriores.
    DEFAULT: {
        reservarConDeudaDeDinero: false,            // se bloquea si debe dinero, igual que "Deudor"
    }
};
