/**
 * ============================================================
 *  PERMISOS GLOBALES — valor por defecto de cada restricción
 * ============================================================
 * Este archivo es el "interruptor maestro" del sistema de permisos.
 * Cada clave representa una acción o comportamiento del sistema
 * de reservas.
 *
 *   activo: true   => la acción está PERMITIDA por defecto para
 *                      todos los alumnos.
 *   activo: false  => la acción está BLOQUEADA/RESTRINGIDA por
 *                      defecto para todos los alumnos.
 *
 * Este valor por defecto se puede sobreescribir para:
 *   - una condición de pago puntual  -> permisosPorCondicionPago.js
 *   - un alumno puntual (por correo) -> permisosPorCorreo.js
 *
 * Orden de prioridad al resolver un permiso (de mayor a menor):
 *   1) permisosPorCorreo.js          (correo específico del alumno)
 *   2) permisosPorCondicionPago.js   (condición de pago del alumno)
 *   3) permisos.js (este archivo)    (valor global por defecto)
 *
 * NOTA: el modo Admin se sigue evaluando aparte en index.html
 * (con la variable isAdmin), tal cual funcionaba antes. Este
 * sistema de permisos solo decide qué puede hacer un alumno
 * "normal" según su correo y su condición de pago.
 *
 * Para cambiar el comportamiento de una restricción en caliente,
 * alcanza con tocar el "activo" de acá abajo.
 */

const PERMISOS_GLOBAL = {

    // ---------------------- Reservas ----------------------

    // Reservar turnos en sábado y domingo.
    reservarFinesDeSemana: {
        activo: false,
        descripcion: 'Permite reservar turnos en sábado y domingo.'
    },

    // Reservar con menos de 12 horas de anticipación.
    reservarSinAnticipacion12h: {
        activo: false,
        descripcion: 'Permite reservar turnos con menos de 12 horas de anticipación.'
    },

    // Superar el límite de 3 horas reservadas en un mismo día.
    superarLimiteHorasPorDia: {
        activo: false,
        descripcion: 'Permite reservar más de 3 horas el mismo día.'
    },

    // Superar el límite de 2 clases reservadas sin pagar (sin pack activo).
    superarLimiteClasesImpagas: {
        activo: false,
        descripcion: 'Permite tener más de 2 clases reservadas sin pagar cuando no hay pack de horas activo.'
    },

    // Reservar aunque el alumno tenga dinero pendiente de pago.
    reservarConDeudaDeDinero: {
        activo: true,
        descripcion: 'Permite reservar aunque el alumno deba dinero. Se restringe explícitamente en permisosPorCondicionPago.js.'
    },

    // Reservar aunque tenga 2 o más clases pendientes de pago (condición "Normal").
    reservarConClasesPendientes: {
        activo: true,
        descripcion: 'Permite reservar con 2 o más clases pendientes de pago. Se restringe explícitamente para la condición "Normal".'
    },

    // Reservar aunque tenga 2+ clases pendientes y la más vieja supere la semana (condición "Regular").
    reservarConClasesPendientesAntiguas: {
        activo: true,
        descripcion: 'Permite reservar con 2+ clases pendientes de más de una semana. Se restringe explícitamente para la condición "Regular".'
    },

    // ---------------- Avisos y recordatorios ----------------

    // Mostrar el aviso de "se cobran intereses por día" al reservar con deuda.
    verAvisoInteresPorDeuda: {
        activo: true,
        descripcion: 'Muestra el aviso de intereses por día al reservar con deuda pendiente.'
    },

    // Mostrar el recordatorio de deuda general al entrar a la app.
    verRecordatorioDeudaAlEntrar: {
        activo: true,
        descripcion: 'Muestra el recordatorio de deuda pendiente al iniciar sesión.'
    },

    // Mostrar la variante "especial" del recordatorio de deuda.
    verRecordatorioDeudaEspecifico: {
        activo: false,
        descripcion: 'Muestra la variante especial del recordatorio de deuda. Pensado para habilitarse solo por correo en permisosPorCorreo.js.'
    }

    
};
