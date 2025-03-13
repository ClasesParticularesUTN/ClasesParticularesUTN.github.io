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
        console.log(clave);
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
            alert("Codigo incorrecto, revisa bien en tu correo");
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
        // Aquí puedes manejar los datos de la respuesta
        console.log("Respuesta del servidor:", res);
    })
    .catch(error => {
        console.log("Hubo un problema con la solicitud:", error);
    })
    .finally(() => {
        document.querySelector("body").style.cursor = "default";
        
        const botonEnviar = document.querySelector("#botonEnviar");
        const contenedorLoader = document.querySelector(".contenedorLoader");
        const codigo = document.querySelector(".codigo");

        if (botonEnviar) {
            botonEnviar.style.cursor = "default";
            botonEnviar.innerHTML = "Cambiar Contraseña";
        }
        if (contenedorLoader) {
            contenedorLoader.style.display = "none";
        }
        if (codigo) {
            codigo.style.display = "block";
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

function verificarPortapapeles() {
    if (navigator.clipboard) {
        navigator.clipboard.readText().then(textoCopiado => {
            if (textoCopiado.length === 6) {
                document.getElementById('codigoInput').value = textoCopiado;
            }
        }).catch(error => {
            console.error('No se pudo acceder al portapapeles:', error);
        });
    }
}

// Escuchar cuando el usuario vuelve a la pestaña
document.addEventListener("visibilitychange", () => {
    if (!document.hidden) {
        // Esperar interacción del usuario antes de leer el portapapeles
        document.addEventListener("click", verificarPortapapeles, { once: true });
    }
});


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
  