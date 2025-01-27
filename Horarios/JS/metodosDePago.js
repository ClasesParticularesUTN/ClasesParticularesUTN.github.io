let botones = document.querySelectorAll(".efectivo, .transferencia");

botones.forEach((boton)=>{
    boton.addEventListener("click",(e)=>{
        window.location.hash = 'Cerrar';
        let metodoDePago = "";
        if (boton.classList.contains("efectivo")) {
            metodoDePago = "Efectivo";
          } else if (boton.classList.contains("transferencia")) {
            metodoDePago = "Transferencia";
          }
        enviarCeldasReservadas(horariosSeleccionados,numeroHoja);
        asignarHorario(horariosSeleccionados,numeroHoja,metodoDePago);
    })
})

let mercadoPago = document.querySelector(".mercadopago");

mercadoPago.addEventListener("click",()=>{
    sessionStorage.setItem("horariosSeleccionados", JSON.stringify(horariosSeleccionados));
    sessionStorage.setItem("numeroHoja", JSON.stringify(numeroHoja));
    window.location.href = "./pagoAnticipado.html";
})