if(sessionStorage.getItem('turnoReservado')){
    window.scrollTo(0, 0);
    document.querySelector(".menu").style.display = "flex";
    let listaClases = document.querySelector(".menu").classList;
    if(!listaClases.contains("animate__zoomOutUp") && !listaClases.contains("animate__slideInDown")){
            listaClases.add("animate__slideInDown");
    }
    
    sessionStorage.removeItem('turnoReservado');
}
