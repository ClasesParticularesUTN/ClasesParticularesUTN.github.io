const tds = document.querySelectorAll(".horario");
var horariosSeleccionados = [];
tds.forEach(td => {
  td.addEventListener("click", () => {
    const dataName = td.getAttribute("data-name");

    
    if (td.style.backgroundColor === "red") {
        td.style.backgroundColor = "white"; 
        horariosSeleccionados =  eliminarElemento(horariosSeleccionados,dataName);
      } else if(td.style.backgroundColor === "white" || td.style.backgroundColor === ""){
        if(validarHorariosSeleccionados(dataName)){
          if(validarFecha(dataName)){
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
      console.log(horariosSeleccionados);
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
  console.log(dataName)
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