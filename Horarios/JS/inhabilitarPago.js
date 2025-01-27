let noEfectivo = [];
let noTransferencia = [];

async function controlDePago(){
    console.log("Llegue hasta aca",Alumno)
    if(Alumno != undefined && noEfectivo.includes(Alumno.correoElectronico)){
        console.log("llegue hasta aca");
        let botonEfectivo = document.querySelector(".efectivo");
        botonEfectivo.style.opacity = "0.2";
        let nuevoBoton = botonEfectivo.cloneNode(true);
        botonEfectivo.parentNode.replaceChild(nuevoBoton, botonEfectivo);
    }
};

async function controlDePago(){
    if(Alumno != undefined && noTransferencia.includes(Alumno.correoElectronico)){
        let botonTransferencia = document.querySelector(".transferencia");
        botonTransferencia.style.opacity = "0.2";
        let nuevoBoton = botonTransferencia.cloneNode(true);
        botonTransferencia.parentNode.replaceChild(nuevoBoton, botonTransferencia);
    }
};