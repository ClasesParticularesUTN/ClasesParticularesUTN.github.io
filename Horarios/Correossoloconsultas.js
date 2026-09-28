// Correos que SOLO pueden reservar clases de consulta.
// Para estos alumnos, el check "Voy a realizar una Clase de Consulta"
// es obligatorio al reservar (index.html lo valida en el modal de materia).
// Agregar/quitar correos acá, en minúsculas.
const CORREOS_SOLO_CONSULTAS = [
    'camiicaceres139@gmail.com'
];

function soloPuedeReservarConsultas(alumno) {
    const correo = String(alumno?.correoElectronico || '').trim().toLowerCase();
    if (!correo) return false;
    return CORREOS_SOLO_CONSULTAS.some(c => String(c).trim().toLowerCase() === correo);
}