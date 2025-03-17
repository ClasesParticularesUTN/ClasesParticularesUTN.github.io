let avisos = {
    CambioUbicacion: "Revisar cambio de ubicacion desde la pagina principal.",
    ColoresDeCeldas: "Blanco: Disponible,<br><span style='color:#9b4922'>Marron</span>: Ocupado, <br><span style='color:violet'>Violeta</span>: Recarga de $1000 al abonar el pago.",
    Sabados: "Es posible reservar horarios sabados por la mañana, aunque no aparesca en la grilla, contactarse por whatsapp."
}

let nombreAvisos = Object.keys(avisos);

nombreAvisos.forEach((aviso)=>{
    if(localStorage.getItem(aviso) === null && sessionStorage.getItem("persona")){
        console.log("asdasdasdkaka");
        document.querySelector(".cafe").style.display = "block";
        const template = document.getElementById('aviso-template');

        // Crear una nueva instancia del contenido del template
        const clon = document.importNode(template.content, true);

        // Modificar el contenido del template
        clon.querySelector('.titulo').innerHTML = agregarEspacios(aviso);
        clon.querySelector('.descripcion').innerHTML = avisos[aviso];

        // Insertar el clon del template en el contenedor
        document.querySelector('.avisos').appendChild(clon);
    }
})

document.querySelector(".cafe").addEventListener("click",()=>{
    nombreAvisos.forEach((aviso)=>{
        localStorage.setItem(aviso,JSON.stringify(aviso));
    })
    window.location.hash = 'VentanaModalAvisos';
    document.querySelector(".cafe").style.display = "none"
})

function agregarEspacios(palabra) {
  // Usamos una expresión regular para encontrar mayúsculas que no estén al principio
  return palabra.replace(/([a-z])([A-Z])/g, '$1 $2');
}
