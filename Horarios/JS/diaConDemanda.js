let diasConDemanda = [];
let soloGrupales = ["Miércoles<br>11/06","Miércoles<br>18/06"];
// --- Pintar columnas según demanda o solo grupales ---
async function pintarColumnasPorDemanda() {
    const ths = document.querySelectorAll('.dia');
    
         ths.forEach((th, idx) => {
        console.log(th.innerHTML);
        const thHtml = th.innerHTML.trim();
                 // Busca si el th está en alguno de los vectores
        if (diasConDemanda.includes(thHtml)) {
            // Pintar toda la columna de violeta
            pintarColumna(idx+1, 'violet');
        } else if (soloGrupales.includes(thHtml)) {
            // Pintar toda la columna de amarillo
            pintarColumna(idx+1, '#ffe066');
        }
    });
};

function pintarColumna(colIdx, color) {
    // Selecciona todas las filas de la tabla
    const filas = document.querySelectorAll('tr');
    filas.forEach((fila, filaIdx) => {
        // Solo pinta celdas que no sean th (es decir, td)
        const celdas = fila.children;
        if (celdas[colIdx] && celdas[colIdx].innerHTML == '' && celdas[colIdx].style.backgroundColor != 'transparent') {
            celdas[colIdx].style.backgroundColor = color;
            celdas[colIdx].innerHTML = 'Solo Grupal';
        }
    });
}

