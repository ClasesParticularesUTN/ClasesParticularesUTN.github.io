

async function cargarHorarios(funcion, numeroHoja) {
    let retornar;
    let urlInterno = URLHorarios + "?funcion=" + funcion;
    if (funcion === "celdasOcupadas") urlInterno += "&numeroHoja=" + numeroHoja;
    else return "error, ARGUMENTO incorrecto";
    try {
        const response = await fetch(urlInterno);

        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
                 retornar = data;
    } catch (err) {
        console.error("Error en fetch:", err.message);
        retornar = null;
    }
    return retornar;
}
var semana1 = [],semana2 = [];
var listoSemana2 = false;
(async () => {
    try {
        semana1 = await cargarHorarios("celdasOcupadas","0");
        await colocarDias(semana1[0]);
        await pintarCeldas(semana1[1]);
        await pintarColumnasPorDemanda();
        semana2 = await cargarHorarios("celdasOcupadas","1");
        quitarLoader();
    } catch (err) {
        console.error("Error al obtener horarios:", err.message);
    }
})();

async function colocarDias(arrayDias) {
    let celdas = document.querySelectorAll(".dia");
    celdas.forEach((celda,indice)=>{
        const [dia, fecha] = arrayDias[indice].split(", ");
        const diaCapitalizado = dia.charAt(0).toUpperCase() + dia.slice(1);
        const resultado = `${diaCapitalizado}<br>${fecha}`;
        celda.innerHTML = resultado;
    })
}

async function pintarCeldas(vector) {
    const tds = document.querySelectorAll("td");

    // Iterar sobre los elementos y verificar coincidencias
    tds.forEach(td => {
        const dataName = td.getAttribute("data-name");
    
        // Verificar si el atributo "data-name" está en el array
        if (vector.includes(dataName)) {
            td.style.backgroundColor = "transparent"; // Cambiar color de fondo
        }
    });
}

function quitarLoader() {
    let loader = document.querySelector(".containerLoader");
    let tabla = document.querySelector("table");
    let botones = document.querySelector(".botones");
    loader.style.display = "none";
    tabla.style.display = "table";
    botones.style.display = "flex";
}
