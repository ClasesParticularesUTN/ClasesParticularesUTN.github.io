let diasConDemanda = [];
let soloGrupales = ["Lunes<br>11/08"];
let consultar = ["Lunes<br>23/06","Martes<br>24/06","Miércoles<br>25/06"];
// --- Pintar columnas según demanda o solo grupales ---
async function pintarColumnasPorDemanda() {
    const ths = document.querySelectorAll('.dia');
    
         ths.forEach((th, idx) => {
        console.log(th.innerHTML);
        const thHtml = th.innerHTML.trim();
                 // Busca si el th está en alguno de los vectores
        if (diasConDemanda.includes(thHtml)) {
            // Pintar toda la columna de violeta
            pintarColumna(idx+1, 'violet',"demanda");
        } else if (soloGrupales.includes(thHtml)) {
            // Pintar toda la columna de amarillo
            pintarColumna(idx+1, '#ffe066',"grupal");
        } else if (consultar.includes(thHtml)){
            pintarColumna(idx+1, '#a2ff79',"consultar");
        }
    });
};

function pintarColumna(colIdx, color, modalidad) {
    // Selecciona todas las filas de la tabla
    const filas = document.querySelectorAll('tr');
    filas.forEach((fila, filaIdx) => {
        // Solo pinta celdas que no sean th (es decir, td)
        const celdas = fila.children;
        
        if (celdas[colIdx] && celdas[colIdx].innerHTML == '' && celdas[colIdx].style.backgroundColor != 'transparent') {
            celdas[colIdx].style.backgroundColor = color;
            if(modalidad == "grupal"){
                celdas[colIdx].innerHTML = 'Solo Grupal';
            }else if(modalidad == "consultar"){
                celdas[colIdx].innerHTML = '(Consultar)';
            }
        }
    });
}

