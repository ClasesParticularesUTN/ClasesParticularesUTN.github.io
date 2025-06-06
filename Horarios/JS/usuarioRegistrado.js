let Alumno;
document.addEventListener("DOMContentLoaded", ()=>{
    if(sessionStorage.getItem('persona') !== null){
        (async () => {
            await colocarDatos();
            await controlDePago();
            actualizarDatos(Alumno.correoElectronico,Alumno.contrasenia);
        })();
    }
})


function actualizarDatos(correo,contraseña){
    let urlFinal = URLUsuarios + "?correo=" + correo + "&contrasenia=" + contraseña + "&funcion=validarUsuario";
    document.querySelector(".listaHorarios").style.display = "none";
    fetch(urlFinal)
      .then(response => {
          if (!response.ok) {
              throw new Error('Network response was not ok');
          }
          return response.json();
      })
      .then(data => {
          if(data.sesion){
              const personaJSON = JSON.stringify(data);
              sessionStorage.removeItem('persona');
              sessionStorage.setItem('persona', personaJSON);
              colocarDatos();
              document.querySelector(".listaHorarios").style.display = "block";
              document.querySelector("#LoaderSencillo").style.display = "none";
          }
      })
      .catch(error => {
          console.error('There was a problem with the fetch operation:', error);
      })
}

function colocarDatos(){
        Alumno = JSON.parse(sessionStorage.getItem('persona'));
        document.querySelector("#MensajeLogin").innerHTML = `Hola, ${Alumno.nombre}`;
        if(parseInt(Alumno.dineroQueDebe.slice(1)) > 0){
            document.querySelector(".usuarioClasesAFAvor").innerHTML = "Dinero que debe: ";
            document.querySelector(".numero").innerHTML = Alumno.dineroQueDebe;
        }
        else document.querySelector(".numero").innerHTML = Alumno.horasAFavor; 
        document.querySelector(".cajaMensajeLogin").style.justifyContent = "end";
        document.querySelector(".cajaMensajeLogin").style.paddingRight = "10px";
        document.querySelector(".usuarioNombre").innerHTML = "Nombre Completo: " + Alumno.nombre + " " + Alumno.apellido;
        document.querySelector(".usuarioCorreo").innerHTML = "Correo: " + Alumno.correoElectronico;
        document.querySelector(".usuarioTelefono").innerHTML= "Telefono: " + Alumno.telefono;
        document.querySelector(".listaHorarios").innerHTML = '';
        Alumno.horarios.forEach(horario => {
            let li = document.createElement("li");
            li.className = "usuarioHorarios";
            li.innerHTML = horario;
            document.querySelector(".listaHorarios").appendChild(li);
        });
        if(Object.keys(Alumno.horarios).length == 0){
            let li = document.createElement("li");
            li.className = "usuarioHorarios";
            li.innerHTML = "(Sin Horarios Reservados)";
            document.querySelector(".listaHorarios").appendChild(li);
        }
}