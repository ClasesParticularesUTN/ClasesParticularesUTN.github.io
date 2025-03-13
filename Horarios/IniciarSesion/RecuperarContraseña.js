let clave=generarCadenaAleatoria();
document.getElementById('formularioRegistro').addEventListener('submit', function (event) {
    event.preventDefault();

    if(document.querySelector("#botonEnviar").innerHTML == "Enviar Codigo"){
        let formData = new FormData(this);
        let datosAEnviar = [];
        formData.forEach((valor, llave) => {
            datosAEnviar.push(valor);
        });
        datosAEnviar[0] = datosAEnviar[0].toLowerCase();
        let urlFinal = URLUsuarios + "?correo=" + encodeURIComponent(datosAEnviar[0]) + "&funcion=recuperarContrasenia"+"&codigo="+clave;
        enviarCodigo(urlFinal);
    }else{
        let texto = document.querySelector("#codigoUsuario").value;
        console.log(texto);
        if(texto == clave){
            let formData = new FormData(this);
            let datosAEnviar = [];
            formData.forEach((valor, llave) => {
                datosAEnviar.push(valor);
            });
            datosAEnviar[0] = datosAEnviar[0].toLowerCase();
            let urlFinal = URLUsuarios + "?correo=" + encodeURIComponent(datosAEnviar[0]) + "&contrasenia=" + encodeURIComponent(datosAEnviar[1]) + "&funcion=modificarContrasenia";
            enviar(urlFinal);
        }else{
            Swal.fire({
            icon: "error",
            title: "Error",
            text: "Codigo incorrecto. Intente nuevamente. Respete Mayúsculas y Minúsculas.",
          });
        }
    }
  })

  function enviarCodigo(urlFinal) {
    console.log(urlFinal)
    document.querySelector("body").style.cursor = "wait";
    document.querySelector("#botonEnviar").style.cursor = "wait";
    document.querySelector(".contenedorLoader").style.display = "flex";
    fetch(urlFinal)
    .then(response => {
        if (!response.ok) {
            throw new Error('Error en la respuesta de la red');
        }
        return response.json();
    })
    .then(res => {
        console.log(res,!res.sesion);
        // Aquí puedes manejar los datos de la respuesta
        if(res.status == false){
            console.log("Entre aca");
            Swal.fire({
            icon: "error",
            title: "Error",
            text: "El correo no existe en la base de datos del servidor. Comuniquese con un administrador.",
          });
        }else if(res.status){
            Swal.fire({
                title: "Información",
                icon: "info",
                html: `Revise su correo electrónico para obtener el código de verificación`,
                showConfirmButton: true
              });
              const botonEnviar = document.querySelector("#botonEnviar");
              const codigo = document.querySelector(".codigo");
              if (codigo) {
                codigo.style.display = "block";
              }
              botonEnviar.innerHTML = "Cambiar Contraseña";
        }
    })
    .catch(error => {
        console.log("Hubo un problema con la solicitud:", error);
    })
    .finally(() => {
        document.querySelector("body").style.cursor = "default";
        
        const contenedorLoader = document.querySelector(".contenedorLoader");

        if (contenedorLoader) {
            contenedorLoader.style.display = "none";
        }
    });
  }
  

  function generarCadenaAleatoria() {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let resultado = '';
    for (let i = 0; i < 6; i++) {
        const indice = Math.floor(Math.random() * caracteres.length);
        resultado += caracteres[indice];
    }
    return resultado;
  }



function enviar(urlFinal) {
    console.log(urlFinal)
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
            console.log(data);
            if(data.status){
                window.location.href = "IniciarSesion.html";
            }
            else{
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Se produjo un error al intentar cambiar la contraseña",
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
  
