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

document.getElementById('formularioRegistro').addEventListener('submit', function (event) {
  event.preventDefault();
  let formData = new FormData(this);
  let datosAEnviar = [];
  formData.forEach((valor, llave) => {
      datosAEnviar.push(valor);
  });
  datosAEnviar[0] = datosAEnviar[0].toLowerCase();
  let urlFinal = URLUsuarios + "?correo=" + encodeURIComponent(datosAEnviar[0]) + "&contrasenia=" + encodeURIComponent(datosAEnviar[1]) + "&funcion=validarUsuario";
  enviar(urlFinal);
})

function enviar(urlFinal) {
  document.querySelector("body").style.cursor = "wait";
  document.querySelector("#botonEnviar").style.cursor = "wait";
  document.querySelector(".contenedorLoader").style.display = "flex";
  fetch(urlFinal).then(response => {
          if (!response.ok) {
              throw new Error('Network response was not ok');
          }
          return response.json();
      })
      .then(data => {
                     if(data.sesion){
              const personaJSON = JSON.stringify(data);
              ;
              sessionStorage.setItem('persona', personaJSON);
              localStorage.setItem('Nombre', JSON.stringify(data.nombre));
              localStorage.setItem('Apellido', JSON.stringify(data.apellido));
              if (document.referrer !== "" && document.referrer != "https://clasesparticularesutn.com.ar/Horarios/Registro/Registro.html" && document.referrer != "http://127.0.0.1:5501/Horarios/IniciarSesion/IniciarSesion.html") {
                window.location.href = document.referrer;
              } else {
                // Redirigir a una página por defecto si no hay "anterior"
                window.location.href = "../index.html";
              }

          }
          else{
              Swal.fire({
                  icon: "error",
                  title: "Error",
                  text: data.error,
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

console.log(document.referrer);
document.querySelectorAll('input').forEach(input => {
  input.setAttribute('autocomplete', 'off');
});

// Al presionar Enter en cualquier parte de la página, simula un click en el botón de iniciar sesión
document.addEventListener('keydown', function(event) {
  if (event.key === 'Enter') {
    const boton = document.querySelector('#botonEnviar');
    if (boton) {
      boton.click();
    }
  }
});

