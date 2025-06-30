const tds = document.querySelectorAll(".horario");
var horariosSeleccionados = [];
let advertenciaGrupal = false;
let advertenciaCostoExtra = false;
let seleccionoUnGrupal = false;

tds.forEach(td => {
  td.addEventListener("click", () => {
    const dataName = td.getAttribute("data-name");
    if (td.style.backgroundColor === "red") {
        let dia = dataName[0]+"2";
        let celdaDia = document.querySelector(`td[data-name="${dia}"]`);
        let innerHTMLDia = celdaDia ? celdaDia.innerHTML : "";
                 horariosSeleccionados = eliminarElemento(horariosSeleccionados, dataName);
        if(diasConDemanda.includes(innerHTMLDia)){
          td.style.backgroundColor = 'violet';
          
        } else if(soloGrupales.includes(innerHTMLDia)){
          seleccionoUnGrupal = false;
          td.style.backgroundColor = '#ffe066';
        } else if(consultar.includes(innerHTMLDia)){
           td.style.backgroundColor = '#a2ff79';
        }
        else td.style.backgroundColor = 'white';
        horariosSeleccionados =  eliminarElemento(horariosSeleccionados,dataName);
      } else{
                 if(td.style.backgroundColor == 'rgb(255, 224, 102)' && !advertenciaGrupal){
          Swal.fire({
            icon: "warning",
            title: "Solo clases grupales",
            text: "El color amarillo indica que este horario está disponible únicamente para clases grupales.",
          }).then(() => {
            advertenciaGrupal = true;
          });
          
        }
        if(td.style.backgroundColor == 'violet' && !advertenciaCostoExtra){
            Swal.fire({
            icon: "info",
            title: "Recargo por horario",
            text: "El color violeta indica que este horario tiene un recargo de $1000 por hora.",
            }).then(() => {
            advertenciaCostoExtra = true;
            });
        }
                 if(validarHorariosSeleccionados(dataName) || Alumno.admin){
          
          if(validarFecha(dataName) || Alumno.admin){

            if(td.style.backgroundColor == 'rgb(255, 224, 102)'){
              seleccionoUnGrupal = true;
            }
            td.style.backgroundColor = "red";
            
            horariosSeleccionados.push(dataName);
          }else{
            Swal.fire({
              icon: "error",
              title: "No es posible reservar en esta fecha",
              text: `Debes reservar turnos como minimo el dia anterior.`,
            });
          }
        }else{
          Swal.fire({
            icon: "error",
            title: "No debes seleccionar varios dias",
            text: `Si quieres varios turnos, tienes que registrarlos por separado.`,
          });
        }
      }
           });
      
});


function eliminarElemento(array, elemento) {
    return array.filter(item => item !== elemento);
}

function validarHorariosSeleccionados(dataName) {
    if(horariosSeleccionados.length == 0) return true;
    else{
        let primerElemento = horariosSeleccionados[0][0];
        if(dataName[0] == primerElemento) return true;
        else return false;
    }
}

function validarFecha(dataName){
     let celda = dataName[0];
  celda = celda + "2";
  celda = document.querySelector(`td[data-name="${celda}"]`);
  let texto = celda.innerHTML; // "Lunes<br>12/10"
  let fechaString = texto.split('<br>')[1];
  let [dia, mes] = fechaString.split("/").map(Number); // Divide y convierte a números

  // Crear un objeto Date usando el año actual
  let fecha = new Date(new Date().getFullYear(), mes - 1, dia); // Restamos 1 al mes porque comienza en 0

  return (fecha > (new Date));
}
