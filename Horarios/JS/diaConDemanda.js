let diasConDemandaSemana1 = ["Miercoles"];
let diasConDemandaSemana2 = [];
let diasRosados = [];
function ponerEnVioleta(vector,numeroSemana) {
    diasRosados = [];
    let diasComoLetras = [];
    vector.forEach(dia => {
        switch (dia) {
            case "Lunes": diasComoLetras.push("B");break;
            case "Martes": diasComoLetras.push("C");break;
            case "Miercoles": diasComoLetras.push("D");break;
            case "Jueves": diasComoLetras.push("E");break;
            case "Viernes": diasComoLetras.push("F");break;
            default: console.log("Error en diaConDemanda.js 13");
        }
    });
    diasComoLetras.forEach((dia)=>{
        let celdas = document.querySelectorAll(`td.horario[data-name*="${dia}"]`);
        celdas.forEach((celda) => {
            if (celda.style.backgroundColor === "white" || celda.style.backgroundColor === "" /*&& !esDeMañana(celda)*/) {
                celda.style.backgroundColor = "violet";
                celda.addEventListener("click",(e)=>{
                    if(e.target.style.backgroundColor == "red"){
                        Swal.fire({
                            title: "Recordatorio",
                            icon: "info",
                            html: `Los horarios en violeta tienen un valor extra de $1000(Puede seleccionar varias celdas y solo se cobrara una vez el recargo)`,
                            showConfirmButton: true
                        });
                    }
                });
                diasRosados.push(celda.getAttribute("data-name"));
            }
        });                
    })
}

function esDeMañana(celda){
    return (celda.getAttribute("data-name").slice(1) == "4" || celda.getAttribute("data-name").slice(1) == "5")
}

