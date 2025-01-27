function irASeccion(id) {
    // Desplazar la página hacia la sección con el ID proporcionado
    const seccion = document.getElementById(id);
    if (seccion) {
        seccion.scrollIntoView({ behavior: 'smooth' });
    }
    document.querySelector("body").style.overflowY = 'auto';
}