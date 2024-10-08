class Persona {
  constructor(nombre, contrasenia, correo) {
    this.nombre = nombre;
    this.contrasenia = contrasenia;
    this.correo = correo;
  }
  obtenerNombre() {
    return this.nombre;
  }
  obtenerApellido() {
    return this.apellido;
  }
  obtenerCorreo() {
    return this.correo;
  }
}
var Alumno;
var url = "https://script.google.com/macros/s/AKfycbxFHD2M8NkIEA28EkkXNQuVT_8rucvH0YcEZgz4S-yrGDxLIfQOwLV004HUUKn2JwU/exec";

document.getElementById('formularioRegistro').addEventListener('submit', function (event) {
  event.preventDefault();
  let formData = new FormData(this);
  let datosAEnviar = [];
  formData.forEach((valor, llave) => {
      datosAEnviar.push(valor);
  });
  datosAEnviar[0] = datosAEnviar[0].toLowerCase();
  let urlFinal = url + "?correo=" + datosAEnviar[0] + "&contrasenia=" + datosAEnviar[1] + "&funcion=validarUsuario";
  enviar(urlFinal);
})

function enviar(urlFinal) {
  document.querySelector("body").style.cursor = "wait";
  document.querySelector("#botonEnviar").style.cursor = "wait";
  document.querySelector(".contenedorLoader").style.display = "flex";
  fetch(urlFinal)
      .then(response => {
          if (!response.ok) {
              throw new Error('Network response was not ok');
          }
          return response.json();
      })
      .then(data => {
          console.log(data);
          if(data.sesion){
              const personaJSON = JSON.stringify(data);
              ;
              sessionStorage.setItem('persona', personaJSON);
              window.location.href = "../index.html";
          }
          else{
              Swal.fire({
                  icon: "error",
                  title: "Error",
                  text: "El correo o la contraseña son erroneas",
                });
          }
      })
      .catch(error => {
          console.error('There was a problem with the fetch operation:', error);
      }).finally(()=>{
        document.querySelector("body").style.cursor = "default";
        document.querySelector("#botonEnviar").style.cursor = "default";
        document.querySelector(".contenedorLoader").style.display = "none";
      }
      );
}
