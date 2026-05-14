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
 * PRECIOS BASE — MATERIAS DE SISTEMAS (ISI)
 * ============================================
 */
const PRECIOS_BASE_SISTEMAS = {
    individual: {
        expres1h: 5000,
        estandar2h: 9000,
        precioPorHora1: 5000,
        precioPorHora2: 4500,
        packExamen: 72000,
        packMateria: 120000,
    },
    grupal: {
        estandar2h: 6000,
        precioPorHora: 3000,
        packExamen: 6000 * 8,
        packMateria: 6000 * 14
    },
    tp: {
        individual: 15000,
        grupal: 20000
    }
};


/**
 * ============================================
 * PRECIOS BASE — MATERIAS BÁSICAS (MATEMÁTICA)
 * ============================================
 */
const PRECIOS_BASE_MATEMATICA = {
    individual: {
        expres1h: 10000,
        estandar2h: 15000,
        estandar2hVirtual: 20000,
        precioPorHora1: 7500,
        precioPorHora2: 7500,
        packExamen: 15000 * 8,
        packMateria: 15000 * 14,
    },
    grupal: {
        estandar2h: 10000,
        estandar2hVirtual: 15000,
        precioPorHora: 5000,
        packExamen: 10000 * 8,
        packMateria: 10000 * 14
    },
    tp: {
        individual: 14000,
        grupal: 18000
    }
};


const STORAGE_TIPO_PRECIOS = "preciosNuevos_tipo";

/**
 * @returns {"sistemas"|"matematica"|null}
 */
function obtenerTipoMateriaGuardado() {
    const t = localStorage.getItem(STORAGE_TIPO_PRECIOS);
    if (t === "matematica" || t === "sistemas") return t;
    return null;
}

function obtenerPreciosBasePorTipo() {
    return obtenerTipoMateriaGuardado() === "matematica"
        ? PRECIOS_BASE_MATEMATICA
        : PRECIOS_BASE_SISTEMAS;
}


/**
 * ============================================
 * PRECIOS ESPECIALES
 * ============================================
 */
const PRECIOS_ESPECIALES = {
    "Martin Sofia": {
        individual: {
            expres1h: 5500,
            estandar2h: 10000,
            precioPorHora1: 5500,
            precioPorHora2: 5000,
            packExamen: 80000,
            packMateria: 160000,
        }
    },
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
            expres1h: 5500,
            estandar2h: 10000,
            precioPorHora1: 5500,
            precioPorHora2: 5000,
            packExamen: 80000,
            packMateria: 160000,
        }
    },
    "Bertoia Delfina": {
        individual: {
            expres1h: 5500,
            estandar2h: 10000,
            precioPorHora1: 5500,
            precioPorHora2: 5000,
            packExamen: 80000,
            packMateria: 160000,
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
 * OBJETO QUE USA LA PÁGINA (según tipo + usuario)
 * ============================================
 */
let PRECIOS = JSON.parse(JSON.stringify(PRECIOS_BASE_SISTEMAS));


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
 * APLICAR PRECIOS SEGÚN USUARIO (sobre base por tipo)
 * ============================================
 */
function aplicarPreciosSegunUsuario(identificador) {

    if (!identificador) return;

    const base = obtenerPreciosBasePorTipo();
    PRECIOS = JSON.parse(JSON.stringify(base));

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
 * Guarda el tipo de materia y recalcula PRECIOS con usuario si existe.
 * @param {"sistemas"|"matematica"} tipo
 */
function establecerTipoMateriaYPrecios(tipo) {
    if (tipo !== "sistemas" && tipo !== "matematica") return;
    localStorage.setItem(STORAGE_TIPO_PRECIOS, tipo);

    const Nombre = localStorage.getItem("Nombre");
    const Apellido = localStorage.getItem("Apellido");
    PRECIOS = JSON.parse(JSON.stringify(obtenerPreciosBasePorTipo()));

    if (Nombre && Apellido) {
        const NombreCompleto = `${Apellido} ${Nombre}`;
        aplicarPreciosSegunUsuario(NombreCompleto);
    }
}


/**
 * Recalcula PRECIOS desde la base del tipo guardado (sin exigir identificador en el argumento).
 */
function recalcularPreciosNuevos() {
    const Nombre = localStorage.getItem("Nombre");
    const Apellido = localStorage.getItem("Apellido");
    PRECIOS = JSON.parse(JSON.stringify(obtenerPreciosBasePorTipo()));

    if (Nombre && Apellido) {
        aplicarPreciosSegunUsuario(`${Apellido} ${Nombre}`);
    }
}


const Nombre = localStorage.getItem("Nombre");
const Apellido = localStorage.getItem("Apellido");

if (obtenerTipoMateriaGuardado()) {
    if (Nombre && Apellido) {
        aplicarPreciosSegunUsuario(`${Apellido} ${Nombre}`);
    } else {
        PRECIOS = JSON.parse(JSON.stringify(obtenerPreciosBasePorTipo()));
        console.warn("No hay usuario identificado");
    }
} else {
    PRECIOS = JSON.parse(JSON.stringify(PRECIOS_BASE_SISTEMAS));
}

console.log("Precios (vista previa base sistemas expres):", PRECIOS_BASE_SISTEMAS.individual.expres1h);

