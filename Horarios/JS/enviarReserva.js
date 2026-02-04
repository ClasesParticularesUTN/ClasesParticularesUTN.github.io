sinTurnosDisponibles = -1;
let admin = 0;

document.querySelector(".enviarReserva").addEventListener("click", async () => {
    reservados = horariosSeleccionados;
    if(Alumno.admin) {
        window.location.hash = "#VentanaModal";
        return;
    }else{
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
    }else if(Alumno.condicionPago == 'Normal' && parseInt(Alumno.dineroQueDebe.slice(1)) > 18000 || Alumno.condicionPago == 'Deudor' && parseInt(Alumno.dineroQueDebe.slice(1)) > 0){
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Debe dinero, antes de reservar otra clase debe saldar la deuda.',
        }).then(() => {
          window.scrollTo(0, 0);
          document.querySelector('.menu').style.display = 'flex';
          let listaClases = document.querySelector('.menu').classList;
          if (!listaClases.contains('animate__zoomOutUp') && !listaClases.contains('animate__slideInDown')) {
            listaClases.add('animate__slideInDown');
          }
        });

    }
    else {
        window.location.hash = "#VentanaModal";
    }
    }
    
});

async function enviarCeldasReservadas(horariosSeleccionados, numeroDeHoja) {
    if (numeroDeHoja == undefined) numeroDeHoja = 0;
    let datos = {
        funcion: "reservarHorario",
        celdas: horariosSeleccionados,
        numeroHoja: numeroDeHoja,
        nombre: Alumno.nombre
    };
    
    
    
    await fetch(URLHorarios, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(datos)
    }).then()
      .catch(function (error) {
          console.error('Error al enviar datos:', error);
      }).finally(() => {
        
         Swal.fire({
                icon: 'success',
                title: 'Datos enviados',
                html: '<span style="color: red; font-weight: bold;">Por favor, revise su correo electronico.',
            }).then(() => {
                // Redirige a la página de horarios
                window.location.hash = "";
                location.reload();

            });
      });
}
let metodoDePago = "";

async function asignarHorario(celdas, numeroDeHoja,integrantes = []) {
    if (numeroDeHoja == undefined) numeroDeHoja = 0;
    if(integrantes.length == 0) integrantes.push(Alumno.correoElectronico);
    let datos = {
        persona: Alumno,
        funcion: "asignarHorario",
        celdas: celdas,
        numeroHoja: numeroDeHoja,
        metodoDePago: metodoDePago,
        integrantes: integrantes,
        precio:(precioInfo.total)/integrantes.length,
        nombre: Alumno.nombre
    };
    console.log(datos)
    if (!integrantes || integrantes.length === 1) {
        document.querySelector("table").style.display = "none";
        document.querySelector(".botones").style.display = "none";
        document.querySelector(".containerLoader").style.display = "flex";
    }
    
    console.log("Llega hasta aca")
    await fetch(URLUsuarios, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(datos)
    }).then(       ).catch(function (error) {
          console.error('Error al enviar datos:', error);
      });
}
