sinTurnosDisponibles = -1;
document.querySelector(".enviarReserva").addEventListener("click", async () => {
    reservados = horariosSeleccionados;
    if(sinTurnosDisponibles == 0 && numeroHoja == 0){
        Swal.fire({
            icon: "error",
            title: "Error",
            text: "Quedan muy pocos horarios disponibles. Consulte por WhatsApp o reserve la proxima semana",
          });
    }else if (Alumno == null || !Alumno.sesion) {
        Swal.fire({
            title: "Accion Erronea",
            icon: "info",
            html: `Debes iniciar sesion para reservar un horario`,
            showConfirmButton: true
          });
    } else if (reservados == undefined || reservados.length == 0) {
        Swal.fire({
            title: "Accion Erronea",
            icon: "info",
            html: `Debes clickear las celdas que quieres reservar`,
            showConfirmButton: true
          });
    }else if(parseInt(Alumno.dineroQueDebe.slice(1)) > 0){
        Swal.fire({
            icon: "error",
            title: "Error",
            text: "Debe dinero, antes de reservar otra clase debe saldar la deuda.",
          }).then(() => {
            window.scrollTo(0, 0);
            document.querySelector(".menu").style.display = "flex";
            let listaClases = document.querySelector(".menu").classList;
            if(!listaClases.contains("animate__zoomOutUp") && !listaClases.contains("animate__slideInDown")){
            listaClases.add("animate__slideInDown");
            }
          });
    }
    else {
        await asignarHorario(reservados,numeroHoja);
        await enviarCeldasReservadas(reservados,numeroHoja);
    }
});

async function enviarCeldasReservadas(horariosSeleccionados, numeroDeHoja) {
    if (numeroDeHoja == undefined) numeroDeHoja = 0;
    let datos = {
        funcion: "reservarHorario",
        celdas: horariosSeleccionados,
        numeroHoja: numeroDeHoja,
    };
    
    
    
    await fetch(URLHorarios, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(datos)
    }).then(console.log("datos enviados"))
      .catch(function (error) {
          console.error('Error al enviar datos:', error);
      }).finally(() => {
        console.log(datos);
         window.location.reload();
      });
}
let metodoDePago = "";

async function asignarHorario(celdas, numeroDeHoja) {
    if (numeroDeHoja == undefined) numeroDeHoja = 0;
    let datos = {
        persona: Alumno,
        funcion: "asignarHorario",
        celdas: celdas,
        numeroHoja: numeroDeHoja,
        metodoDePago: metodoDePago
    };
    
    document.querySelector("table").style.display = "none";
    document.querySelector(".botones").style.display = "none";
    document.querySelector(".containerLoader").style.display = "flex";
    
    await fetch(URLUsuarios, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(datos)
    }).then(console.log("datos enviados")).finally(console.log(datos))
      .catch(function (error) {
          console.error('Error al enviar datos:', error);
      });
}
