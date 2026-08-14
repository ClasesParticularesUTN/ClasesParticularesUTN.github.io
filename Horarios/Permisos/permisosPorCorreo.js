/**
 * ============================================================
 *  PERMISOS PERSONALIZADOS POR CORREO (Alumno.correoElectronico)
 * ============================================================
 * Máxima prioridad: lo que se defina acá pisa tanto el valor
 * global (permisos.js) como el de la condición de pago
 * (permisosPorCondicionPago.js).
 *
 * Usalo para habilitar o prohibir un permiso puntual a un
 * alumno específico, sin importar su condición de pago.
 *
 * El correo se compara sin importar mayúsculas/minúsculas ni
 * espacios al principio/final.
 *
 * Formato:
 *   'correo@ejemplo.com': {
 *       nombreDelPermiso: true | false,
 *       ...
 *   }
 */

const PERMISOS_POR_CORREO = {

    // Acceso a turnos de fin de semana (ya lo tenían habilitado antes)
    'valedasilvacatela.vdc@gmail.com': {
        reservarFinesDeSemana: false
    },
    'vmosquen@gmail.com': {
        reservarFinesDeSemana: true
    },
    'juanma.2000@hotmail.com': {
        reservarFinesDeSemana: true
    },

    // Correos con el recordatorio de deuda "especial" (ya lo tenían antes)
    'paulinalisvillanueva@gmail.com': {
        verRecordatorioDeudaAlEntrar: false,
        verRecordatorioDeudaEspecifico: false
    },
    'andresnigorrafac2026@gmail.com': {
        verRecordatorioDeudaAlEntrar: false,
        verRecordatorioDeudaEspecifico: true
    },

    
    
    "ccamilavilla@gmail.com": {
        reservarSinAnticipacion12h: true
    },

    // Ejemplo para agregar una excepción nueva a un alumno puntual:
    // 'correo@ejemplo.com': {
    //     reservarConDeudaDeDinero: true,   // le permitimos reservar aunque deba dinero
    //     superarLimiteHorasPorDia: false   // pero le prohibimos pasarse de 3 horas por día
    // }
};
