class EnvioPOST{
    constructor (funcion,datosAlumno){
        this.funcion = funcion;
		this.datosAlumnos = datosAlumno;
    }
}


document.getElementById('formularioRegistro').addEventListener('submit', function(event) {
    event.preventDefault();
    if(validarFormulario()){
        let formData = new FormData(this);
        let datosAEnviar = [];
	    let materia = "";
        let numeroTelefonico = "";
        let contadorMateria = 0;
        formData.forEach((valor, llave) => {
            if(llave == "Materia" && contadorMateria == 0){
                materia+=valor;
                contadorMateria++;
            }
            else if(contadorMateria == 1){
                if(llave=="Materia"){
                    materia= materia + " y " + valor;
                    datosAEnviar.push(materia);
                    contadorMateria++;
                    
                }else{
                    datosAEnviar.push(materia);
                    contadorMateria++;
                    
                }
            }
            if(llave == "correoElectronico"){
                datosAEnviar.push(valor.trim());
            }else if(llave != "Area" && llave != "Telefono" && llave != "Materia" && llave != "RepetirContrasenia"){
                datosAEnviar.push(valor);
            }else if(llave == "Area"){
                numeroTelefonico+=valor;
            }else if(llave == "Telefono"){
                numeroTelefonico+=valor;
                datosAEnviar.push(numeroTelefonico);
            }
        });
        datosAEnviar[2] = datosAEnviar[2].toLowerCase();
        datosAEnviar.push(contraseñas);
        
        let envioFetch = new EnvioPOST("agregarAlumno",datosAEnviar);
        enviar(envioFetch);
   }
})
let contardorContraseñas = 0, contraseñas = [];
function validarMateria(){
    const algoritmosSeleccionado = document.getElementById('input_84_0').checked;
    const arquitecturaSeleccionado = document.getElementById('input_84_1').checked;
    //conso(algoritmosSeleccionado,arquitecturaSeleccionado);
    if (!algoritmosSeleccionado && !arquitecturaSeleccionado) {
        Swal.fire({
            icon: "error",
            title: "Error en materias que te interesan",
            text: "Debes seleccionar al menos una de las opciones",
          });
      return false;
    }
  
    // Si se ha seleccionado al menos una materia, enviar el formulario
    return true;
}
function validarContrasenia(){
    var contraseña = document.getElementById("Contraseña").value;
    var Repetircontraseña = document.querySelector("#RepetiContraseña").value;
    if(contraseña !== Repetircontraseña){
        Swal.fire({
            icon: "error",
            title: "Error en contraseña",
            text: "Las contraseñas no coinciden, vuelve a escribirlas",
        });
        return false;
    }
    //conso(contraseña.length);
    if(contardorContraseñas < 1 || contraseñas.includes(contraseña)){
        Swal.fire({
            icon: "error",
            title: "Error en contraseña",
            text: "Elige una clave mas dificil",
          });
          contardorContraseñas++;
          if(!contraseñas.includes(contraseña)) contraseñas.push(contraseña);
          return false;
    }else if(contraseña.length < 4){
        Swal.fire({
            icon: "error",
            title: "Error en contraseña",
            text: "La contraseña es demasiado corta",
          });
          contardorContraseñas++;
          contraseñas.push(contraseña);
          return false;
    }
    else if(detectarSecuenciaNumeros(contraseña)){
        Swal.fire({
            icon: "error",
            title: "Error en contraseña",
            text: `La contraseña no debe tener una secuencia de numeros como 1234 o 4321`,
          });
          contraseñas.push(contraseña);
          return false;    
    }
    else if(textoConPalabrasProhibidas(contraseña,contraseñasFaciles) !== -1){
        Swal.fire({
            icon: "error",
            title: "Error en contraseña",
            text: `La contraseña no debe incluir la siguiente palabra: ${contraseñasFaciles[textoConPalabrasProhibidas(contraseña,contraseñasFaciles)]}`,
          });
          contraseñas.push(contraseña);
          return false;
    }
    else {
        
    }
    return true;
}

function validarFormulario() {
    if(!validarContrasenia()) return false;
    else if(!validarMateria()) return false;
    return true;
}
function detectarSecuenciaNumeros(texto) {
    let resultado = false, contadorAscendente = 0,contadorDescendente = 0;
    for(let i = 0; i < (texto.length - 1);i++){
        if(codigoAscii(texto[i]) === codigoAscii(texto[i+1])-1){
            contadorAscendente++;
        }else{
            contadorAscendente = 0;
        }
        if(contadorAscendente == 3){
            resultado = true;
            break;
        }
        if(codigoAscii(texto[i]) === codigoAscii(texto[i+1])+1){
            contadorDescendente++;
        }else{
            contadorDescendente = 0;
        }
        if(contadorDescendente == 3){
            resultado = true;
            break;
        }
    }
    return resultado;
}

const codigoAscii = (caracter) => caracter.charCodeAt(0);

let contraseñasFaciles = ["password","contraseña","hola","hola123321","asd"];

function textoConPalabrasProhibidas(texto, palabrasProhibidas) {
    texto = texto.toLowerCase();
    for(let i = 0; i < palabrasProhibidas.length;i++){
        let palabra = palabrasProhibidas[i].toLowerCase();
        if(texto.toLowerCase().includes(palabra)) return i;
    }
    return -1;
  }
  


function enviar(datos){
      // Envío de datos al servidor
      document.querySelector(".contenedorLouder").style.zIndex = "100";
      document.querySelector(".loader").style.display = "block";
      document.querySelector("form").style.opacity = "0.3";

      fetch(URLUsuarios, {
          method: 'POST',
          mode: 'no-cors',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(datos)
      }).then(function(response) {
          //conso(response);
          document.querySelector(".loader").style.display = "none";
          document.querySelector(".contenedorLouder").style.zIndex = "-100";
          document.querySelector("form").style.opacity = "1";
          Swal.fire({
            icon: "success",
            title: "Registro exitoso",
            confirmButtonText: 'OK'
          }).then(()=>window.location.href = "../IniciarSesion/IniciarSesion.html");
      }).catch(function(error) {
          console.error('Error al enviar datos:', error);
      });
}
function completar(){
    document.getElementById("first_20").value = "Joaquin";
    document.getElementById("last_20").value = "Da Silva Catela";
    document.getElementById("input_4").value = "joadasilvacatela@gmail.com";
    document.getElementById("Contraseña").value = "santafesino123";
    document.getElementById("RepetiContraseña").value = "santafesino123";
    document.getElementById("input_22_area").value = "342";
    document.getElementById("input_22_phone").value = "5986867";
    document.getElementById("input_24").value = "2023";
    document.getElementById("input_84_0").checked = true;
    document.getElementById("input_26").value = "Recursando";
    document.getElementById("input_27").value = "Prueba";       
}
