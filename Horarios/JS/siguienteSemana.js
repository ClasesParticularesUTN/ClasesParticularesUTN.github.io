let botonSiguiente = document.querySelector(".sig");
let numeroHoja  = 0;
botonSiguiente.addEventListener("click",()=>{
    if(botonSiguiente.innerHTML == "Siguiente Semana"){
        despintarCeldas();
        colocarDias(semana2[0]);
        pintarCeldas(semana2[1]);
        pintarCeldas(celdasFijas);
        ponerEnVioleta(diasConDemandaSemana2,1);
        botonSiguiente.innerHTML = "Semana Anterior";
        horariosSeleccionados = [];
        numeroHoja  = 1;
    }else{
        despintarCeldas();
        colocarDias(semana1[0]);
        pintarCeldas(semana1[1]);
        pintarCeldas(celdasFijas);
        ponerEnVioleta(diasConDemandaSemana1,1);
        botonSiguiente.innerHTML = "Siguiente Semana";
        horariosSeleccionados = [];
        numeroHoja  = 0;
    }
})

function despintarCeldas() {
    let celdas = document.querySelectorAll(".horario");
    celdas.forEach(celda=>{
        celda.style.backgroundColor = "white";
    })
}
