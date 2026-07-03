/**
 * ============================================================
 *  MOTOR DE PERMISOS
 * ============================================================
 * Combina los 3 archivos de configuración (global, condición de
 * pago y correo) para resolver si una acción está permitida para
 * un alumno determinado.
 *
 * Prioridad de resolución: correo > condición de pago > global.
 *
 * Requiere que permisos.js, permisosPorCondicionPago.js y
 * permisosPorCorreo.js estén cargados ANTES que este archivo
 * (ver el orden de los <script> en index.html).
 *
 * Uso:
 *   tienePermiso('reservarFinesDeSemana', Alumno)  -> true | false
 *
 * Nota: el modo Admin (variable isAdmin de index.html) no pasa
 * por acá, se sigue evaluando aparte en cada lugar donde ya se
 * evaluaba antes (igual que en el código original).
 */

function tienePermiso(clave, alumno) {
    const correo = String(alumno?.correoElectronico || '').trim().toLowerCase();

    // 1) Excepción puntual por correo (máxima prioridad)
    const reglasCorreo = correo ? PERMISOS_POR_CORREO[correo] : null;
    if (reglasCorreo && Object.prototype.hasOwnProperty.call(reglasCorreo, clave)) {
        return !!reglasCorreo[clave];
    }

    // 2) Excepción por condición de pago
    const condicion = alumno?.condicionPago || 'DEFAULT';
    const reglasCondicion = PERMISOS_POR_CONDICION_PAGO[condicion] || PERMISOS_POR_CONDICION_PAGO.DEFAULT || {};
    if (Object.prototype.hasOwnProperty.call(reglasCondicion, clave)) {
        return !!reglasCondicion[clave];
    }

    // 3) Valor global por defecto
    const permisoGlobal = PERMISOS_GLOBAL[clave];
    if (permisoGlobal) return !!permisoGlobal.activo;

    // Clave no definida en ningún archivo: no debería pasar, pero
    // preferimos no romper el flujo de reservas por un typo.
    console.warn(`[Permisos] Se consultó una clave no definida: "${clave}". Se permite por defecto.`);
    return true;
}

/**
 * Variante que además informa de dónde salió el valor (útil para
 * debug desde la consola: motivoPermiso('reservarConDeudaDeDinero', Alumno)).
 */
function motivoPermiso(clave, alumno) {
    const correo = String(alumno?.correoElectronico || '').trim().toLowerCase();

    const reglasCorreo = correo ? PERMISOS_POR_CORREO[correo] : null;
    if (reglasCorreo && Object.prototype.hasOwnProperty.call(reglasCorreo, clave)) {
        return { valor: !!reglasCorreo[clave], origen: 'correo', detalle: correo };
    }

    const condicion = alumno?.condicionPago || 'DEFAULT';
    const reglasCondicion = PERMISOS_POR_CONDICION_PAGO[condicion] || PERMISOS_POR_CONDICION_PAGO.DEFAULT || {};
    if (Object.prototype.hasOwnProperty.call(reglasCondicion, clave)) {
        return { valor: !!reglasCondicion[clave], origen: 'condicionPago', detalle: condicion };
    }

    const permisoGlobal = PERMISOS_GLOBAL[clave];
    if (permisoGlobal) {
        return { valor: !!permisoGlobal.activo, origen: 'global', detalle: null };
    }

    return { valor: true, origen: 'default-desconocido', detalle: clave };
}
