let HorariosReservados;
let URL = "https://script.google.com/macros/s/AKfycbzCYWjTBgnj_VfhlpiirxcsAINxDAcNbcOLNJ0Bg762WiEqitx5gHjJB7S3CePVhA/exec";

async function cargarHorarios(funcion,numeroHoja){
    let retornar;
    let  urlInterno = URL + "?funcion="+funcion;
    if(funcion == "celdasOcupadas") urlInterno += "&numeroHoja="+numeroHoja;
    else return "error";
    try {
        
        const response = await fetch(urlInterno);
        if (!response.ok) {
          throw new Error('La solicitud fall�.');
        }
        const data = await response.json();
        
        retornar = data[1];
    }catch(err){
        console.log("error: ", err);
    }finally{
        document.querySelector(".loader").style.display = "none";
        document.querySelector(".gridContainer").style.display = "grid";
        document.querySelector(".cajaBotonReservar").style.display = "flex";
    }
    return retornar;
}

function cambiarFondoCeldas(arrayCeldas) {

    document.querySelectorAll(".gridItem").forEach((celda)=>{
        if(celda.style.backgroundColor == "transparent") celda.style.backgroundColor = "white";
    })

    const tablaHorarios = document.querySelector(".gridContainer");
    const celdas = tablaHorarios.querySelectorAll("*");

    for(let i = 0; i < celdas.length; i++){
        if(arrayCeldas.includes(i + 1)){
            celdas[i].style.backgroundColor = "transparent";
            celdas[i].style.border = "1px solid black";
        }
    }
}


function crearLoader(){
    const gif = document.createElement('img');

    // Asignar la fuente del GIF
    let random = Math.floor(Math.random() * 13) + 1;
    gif.src = `assets/Gift/${random}.gif`;

    // Opcional: Establecer atributos como alt o estilo
    gif.alt = 'Mi GIF dinámico';
    gif.style.width = '300px'; // Cambia el tamaño si es necesario

    // Agregar el GIF al DOM (al contenedor específico)
    const contenedor = document.getElementById('contenedor-gif');
    return gif;
}

async function obtenerHorarios(numeroHoja) {
    let arrayHorarios = await cargarHorarios("celdasOcupadas", numeroHoja);
    let resultado = await arrayHorarios;
    return await resultado;
}
var Semana1;

(function cargarDatosInicial(){
        document.querySelector(".cajaBotonReservar").style.display = "none";
        let loader = crearLoader();
        loader.className = "loader";
        document.querySelector(".tablaHorarios").appendChild(loader);

        obtenerHorarios("0").then((celdas) => {
            cambiarFondoCeldas(celdas);  // Llamada a la función con el array
            Semana1 = celdas;
        });
        
        
})()

var Semana2;
obtenerHorarios("1").then((celdas) => {
    Semana2 = celdas;
    console.log(celdas);
});
  
  
