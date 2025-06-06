let botonSiguiente = document.querySelector(".sig");
let numeroHoja  = 0;
botonSiguiente.addEventListener("click",async ()=>{
    if(botonSiguiente.innerHTML == "Siguiente Semana"){
        await despintarCeldas();
        await colocarDias(semana2[0]);
        await pintarCeldas(semana2[1]);
        await pintarCeldas(celdasFijas);
        await pintarColumnasPorDemanda();
        botonSiguiente.innerHTML = "Semana Anterior";
        horariosSeleccionados = [];
        numeroHoja  = 1;
    }else{
        await despintarCeldas();
        await colocarDias(semana1[0]);
        await pintarCeldas(semana1[1]);
        await pintarCeldas(celdasFijas);
        await pintarColumnasPorDemanda();
        botonSiguiente.innerHTML = "Siguiente Semana";
        horariosSeleccionados = [];
        numeroHoja  = 0;
    }
})

async function despintarCeldas() {
    let celdas = document.querySelectorAll(".horario");
    celdas.forEach(celda=>{
        celda.style.backgroundColor = "white";
        celda.innerHTML = ''
    })
}
