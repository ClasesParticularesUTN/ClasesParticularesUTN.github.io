/**
 * Precios centralizados de clases particulares - C/S Ingeniería en Sistemas
 * Todas las páginas que necesiten mostrar o calcular precios deben usar estas variables.
 */
const PRECIOS = {
    individual: {
        expres1h: 5000,           // Clase Express - 1 hora
        estandar2h: 9000,         // Clase Estándar - 2 horas
        precioPorHora1: 5000,     // Por hora cuando es 1 sola hora
        precioPorHora2: 4500,     // Por hora cuando son 2 o más horas
        packExamen: 72000,        // Pack Preparación Examen - 10 clases (20hs)
        packMateria: 120000       // Pack Preparación Materia - 20 clases (40hs)
    },
    grupal: {
        estandar2h: 6000,         // Clase Estándar - 2 horas (por persona)
        precioPorHora: 3000,      // Por hora por persona
        packExamen: 48000,        // Pack Preparación Examen (por persona)
        packMateria: 80000        // Pack Preparación Materia (por persona)
    },
    tp: {
        individual: 15000,        // Clase individual - 2 horas
        grupal: 20000             // Clase grupal - 2 horas (precio total del grupo)
    }
};
