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
        expres1h: 5000,
        estandar2h: 9000,
        precioPorHora1: 5000,
        precioPorHora2: 4500,
        packExamen: 72000,
        packMateria: 120000
    },
    grupal: {
        estandar2h: 6000,
        precioPorHora: 3500,
        packExamen: 6000 * 8,
        packMateria: 6000 * 16
    },
    tp: {
        individual: 15000,
        grupal: 20000
    }
};


/**
 * ============================================
 * PRECIOS ESPECIALES
 * (Podés escribir las claves como quieras)
 * ============================================
 */
const PRECIOS_ESPECIALES = {
    "Mosquen Valentin Ignacio": {
        grupal: {
            estandar2h: 7000,
            precioPorHora: 3500,
            packExamen: 7000 * 8,
            packMateria: 7000 * 16
        }
    },
    "Benitez Juan Martin": {
        grupal: {
            estandar2h: 7000,
            precioPorHora: 3500,
            packExamen: 7000 * 8,
            packMateria: 7000 * 16
        }
    },
    "Vogt Joel": {
        individual: {
            packExamen: 75000,
            packMateria: 145000
        }
    }
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