sinTurnosDisponibles = -1;
document.querySelector(".enviarReserva").addEventListener("click", async () => {
    reservados = horariosSeleccionados;
    if(sinTurnosDisponibles == 0 && numeroHoja == 0){
        Swal.fire({
            icon: "error",
            title: "Error",
            text: "Quedan muy pocos horarios disponibles. Consulte por WhatsApp o reserve la proxima semana",
          });
    }else
    if (Alumno == null || !Alumno.sesion) {
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
    } else {
        window.location.hash = 'VentanaModal';
    }
});

async function elegirMetodoDePago() {
    let metodosDePago = document.querySelector("metodosPago");

    // await enviarCeldasReservadas(reservados,numeroHoja);
    // await asignarHorario(reservados,numeroHoja);
}

async function enviarCeldasReservadas(horariosSeleccionados, numeroDeHoja) {
    if (numeroDeHoja == undefined) numeroDeHoja = 0;
    let datos = {
        funcion: "reservarHorario",
        celdas: horariosSeleccionados,
        numeroHoja: numeroDeHoja,
    };
    document.querySelector("table").style.display = "none";
    document.querySelector(".botones").style.display = "none";
    document.querySelector(".containerLoader").style.display = "flex";
    
    
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

async function asignarHorario(celdas, numeroDeHoja, metodoDePago) {
    if (numeroDeHoja == undefined) numeroDeHoja = 0;
    let datos = {
        persona: Alumno,
        funcion: "asignarHorario",
        celdas: celdas,
        numeroHoja: numeroDeHoja,
        metodoDePago: metodoDePago
    };
    
    console.log("AsginarHorarios",datos);
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