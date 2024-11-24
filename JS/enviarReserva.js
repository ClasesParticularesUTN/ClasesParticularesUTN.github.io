sinTurnosDisponibles = -1;
document.querySelector(".botonReservar").addEventListener("click", async () => {
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
        await enviarCeldasReservadas(reservados,numeroHoja);
        await asignarHorario(reservados,numeroHoja);
    }
});

async function enviarCeldasReservadas(horariosSeleccionados, numeroDeHoja) {
    if (numeroDeHoja == undefined) numeroDeHoja = 0;
    let datos = {
        funcion: "reservarHorario",
        celdas: horariosSeleccionados,
        numeroHoja: numeroDeHoja,
    };
    let url = "https://script.google.com/macros/s/AKfycbxoJbbckYhPs7_w1h1GSfFMDqnpgH1lo3sPQ_E8oRCmgONru_tT55W703WDh9MPcg/exec";

    document.querySelector(".gridContainer").style.display = "none";
    let loader = crearLoader();
    loader.className = "loader";
    document.querySelector(".tablaHorarios").appendChild(loader);

    await fetch(url, {
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
          window.location.reload();
      });
}

async function asignarHorario(celdas, numeroDeHoja) {
    if (numeroDeHoja == undefined) numeroDeHoja = 0;
    let datos = {
        persona: Alumno,
        funcion: "asignarHorario",
        celdas: celdas,
        numeroHoja: numeroDeHoja,
    };
    let url = "https://script.google.com/macros/s/AKfycbwXSwyEloLUO58ruobUs-Az_iPBxY1p5G0bWaLKNyQ9JJfL4Vu1v3ZeNXEJU9kCijQ/exec";
    console.log("AsginarHorarios",datos);
    await fetch(url, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(datos)
    }).then(console.log("datos enviados"))
      .catch(function (error) {
          console.error('Error al enviar datos:', error);
      });
}
