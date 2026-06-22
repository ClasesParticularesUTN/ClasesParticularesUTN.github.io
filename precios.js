/**
 * ============================================
 * FUNCIÓN PARA NORMALIZAR TEXTO
 * (ignora mayúsculas y espacios de más)
 * ============================================
 */
function normalizarTexto(texto) {
    return texto
        ?.trim()
        .toLowerCase()
        .replace(/\s+/g, " ");
}


/**
 * ============================================
 * PRECIOS BASE (NO SE MODIFICAN)
 * ============================================
 */
const PRECIOS_BASE = {
    individual: {
            expres1h: 6500,
            estandar2h: 10000,
            precioPorHora1: 6500,
            precioPorHora2: 5000,
            packExamen: 10000 * 8,
            packMateria: 10000 *14,
    },
    grupal: {
        estandar2h: 7000,
        precioPorHora: 3500,
        packExamen: 7000 * 8,
        packMateria: 7000 * 14
    },
    tp: {
        individual: 20000,
        grupal: 15000
    }
};


/**
 * ============================================
 * PRECIOS ESPECIALES
 * (Podés escribir las claves como quieras)
 * ============================================
 */
const PRECIOS_ESPECIALES = {
    "Villa Camila": {
        individual: {
            expres1h: 5000,
            estandar2h: 9000,
            precioPorHora1: 5000,
            precioPorHora2: 4500,
            packExamen: 72000,
            packMateria: 9000 * 14,
        }
    },
    "Trancaso Nicolas": {
        individual: {
            expres1h: 7500,
            estandar2h: 12000,
            precioPorHora1: 7500,
            precioPorHora2: 6000,
            packExamen: 12000 * 8,
            packMateria: 12000 * 14,
        }
    },
    "Da Silva Valentin": {
        individual: {
            expres1h: 10,
            estandar2h: 10,
            precioPorHora1: 10,
            precioPorHora2: 10,
            packExamen: 10,
            packMateria: 20,
        }
    },
    "Villanueva Paulina": {
        individual: {
            expres1h: PRECIOS_BASE.individual.expres1h + 1000,
            estandar2h: PRECIOS_BASE.individual.estandar2h + 2000,
            precioPorHora1: PRECIOS_BASE.individual.precioPorHora1 + 1000,
            precioPorHora2: PRECIOS_BASE.individual.precioPorHora2 + 1000,
            packExamen: (PRECIOS_BASE.individual.estandar2h + 2000) * 8,
            packMateria: (PRECIOS_BASE.individual.estandar2h + 2000) * 14,
        },
        grupal: {
            estandar2h: PRECIOS_BASE.grupal.estandar2h + 2000,
            precioPorHora: PRECIOS_BASE.grupal.precioPorHora + 1000,
            packExamen: (PRECIOS_BASE.grupal.estandar2h + 2000) * 8,
            packMateria: (PRECIOS_BASE.grupal.estandar2h + 2000) * 14
        },
        tp: {
            individual: 25000,
            grupal: 18000
        }
    }, 
    
    "Nigorra Andres": {
        individual: {
            expres1h: PRECIOS_BASE.individual.expres1h + 1000,
            estandar2h: PRECIOS_BASE.individual.estandar2h + 2000,
            precioPorHora1: PRECIOS_BASE.individual.precioPorHora1 + 1000,
            precioPorHora2: PRECIOS_BASE.individual.precioPorHora2 + 1000,
            packExamen: (PRECIOS_BASE.individual.estandar2h + 2000) * 8,
            packMateria: (PRECIOS_BASE.individual.estandar2h + 2000) * 14,
        },
        grupal: {
            estandar2h: PRECIOS_BASE.grupal.estandar2h + 2000,
            precioPorHora: PRECIOS_BASE.grupal.precioPorHora + 1000,
            packExamen: (PRECIOS_BASE.grupal.estandar2h + 2000) * 8,
            packMateria: (PRECIOS_BASE.grupal.estandar2h + 2000) * 14
        },
        tp: {
            individual: 25000,
            grupal: 18000
        }
    },
};


/**
 * ============================================
 * DESCUENTOS ESPECIALES
 * ============================================
 */
const DESCUENTOS_ESPECIALES = {
    "Vip@gmail.com": 0.8,
    "Becado@gmail.com": 0.5
};


/**
 * ============================================
 * OBJETO QUE USA TODA LA WEB
 * ============================================
 */
let PRECIOS = JSON.parse(JSON.stringify(PRECIOS_BASE));


/**
 * ============================================
 * FUNCIÓN QUE BUSCA COINCIDENCIA IGNORANDO CASE
 * ============================================
 */
function buscarClaveCoincidente(objeto, identificador) {

    const claveNormalizada = normalizarTexto(identificador);

    for (let clave in objeto) {
        if (normalizarTexto(clave) === claveNormalizada) {
            return objeto[clave];
        }
    }

    return null;
}


/**
 * ============================================
 * APLICAR PRECIOS SEGÚN USUARIO
 * ============================================
 */
function aplicarPreciosSegunUsuario(identificador) {

    if (!identificador) return;

    // Resetear siempre a base
    PRECIOS = JSON.parse(JSON.stringify(PRECIOS_BASE));

    // 1️⃣ Buscar precios especiales
    const especiales = buscarClaveCoincidente(
        PRECIOS_ESPECIALES,
        identificador
    );

    if (especiales) {
        for (let tipo in especiales) {
            for (let categoria in especiales[tipo]) {
                PRECIOS[tipo][categoria] = especiales[tipo][categoria];
            }
        }
    }

    // 2️⃣ Buscar descuentos especiales
    const descuento = buscarClaveCoincidente(
        DESCUENTOS_ESPECIALES,
        identificador
    );

    if (descuento) {
        for (let tipo in PRECIOS) {
            for (let categoria in PRECIOS[tipo]) {
                PRECIOS[tipo][categoria] =
                    PRECIOS[tipo][categoria] * descuento;
            }
        }
    }
}


/**
 * ============================================
 * OBTENER USUARIO DESDE LOCALSTORAGE
 * ============================================
 */
const Nombre = localStorage.getItem("Nombre");
const Apellido = localStorage.getItem("Apellido");

if (Nombre && Apellido) {

    const NombreCompleto = `${Apellido} ${Nombre}`;

    aplicarPreciosSegunUsuario(NombreCompleto);

} else {
    console.warn("No hay usuario identificado");
}


/**
 * ============================================
 * EJEMPLO
 * ============================================
 */
console.log("Precio final:", PRECIOS.individual.expres1h);
