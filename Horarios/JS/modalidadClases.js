function mostrarCampos() {
    const modalidad = document.querySelector('input[name="modalidad"]:checked');
    const grupoContainer = document.getElementById('grupo-container');
    const numIntegrantes = document.getElementById('num-integrantes');

    if (modalidad && modalidad.value === 'grupal') {
        grupoContainer.style.display = 'flex';
        if (numIntegrantes.value) {
            generarCampos();
        }
    } else {
        grupoContainer.style.display = 'none';
    }
}

function generarCampos() {
    const cantidad = parseInt(document.getElementById('num-integrantes').value) || 0;
    const integrantesDiv = document.getElementById('integrantes');
    integrantesDiv.innerHTML = '';
    for (let i = 1; i <= cantidad; i++) {
        const label = document.createElement('label');
        label.textContent = `Correo del integrante ${i}:`;
        label.setAttribute('for', `correo-integrante-${i}`);
        const input = document.createElement('input');
        input.type = 'email';
        input.id = `correo-integrante-${i}`;
        input.name = `correo-integrante-${i}`;
        input.placeholder = 'ejemplo@gmail.com';
        input.required = true;
        input.style.margin = '5px 0 10px 0';
        integrantesDiv.appendChild(label);
        integrantesDiv.appendChild(input);
        integrantesDiv.appendChild(document.createElement('br'));
    }
}

// Función para enviar los correos al backend
async function enviarCorreosIntegrantes() {
    const modalidad = document.querySelector('input[name="modalidad"]:checked').value;
    if (modalidad !== 'grupal') return; // Solo aplica para grupal
    const numIntegrantes = parseInt(document.getElementById('num-integrantes').value) || 0;
    if (numIntegrantes < 2) {
        Swal.fire({
            icon: 'error',
            title: 'Cantidad insuficiente',
            text: 'En la modalidad grupal debe haber al menos 2 integrantes.'
        });
        return;
    }
    let correos = [];
    let camposCompletos = true;
    for (let i = 1; i <= numIntegrantes; i++) {
        const input = document.getElementById(`correo-integrante-${i}`);
        if (!input || !input.value.trim()) {
            camposCompletos = false;
            input && input.classList.add('input-error');
        } else {
            correos.push(input.value.trim());
            input.classList.remove('input-error');
        }
    }
    if (!camposCompletos) {
        Swal.fire({
            icon: 'error',
            title: 'Completa todos los correos',
            text: 'Debes ingresar el correo de cada integrante.'
        });
        return;
    }
    // Llamada a la API
    try {
        // Oculta los hijos del modal y muestra un loader
        const modal = document.querySelector('.modal');
        cargarLoader();
        const url = `${URLUsuarios}?funcion=verificarCorreos&correos=${encodeURIComponent(JSON.stringify(correos))}`;
        console.log(url);
        const response = await fetch(url);
        const data = await response.json();
        if (data.error && data.error !== false) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: data.error
            }).then(() => {
                // Muestra nuevamente los campos del modal
                const modal = document.querySelector('.modal');
                if (modal) {
                    Array.from(modal.children).forEach(child => {
                        if (!child.classList.contains('loader')) {
                            child.style.display = '';
                        }
                    });
                    // Oculta el loader si existe
                    const loader = modal.querySelector('.loader');
                    if (loader && loader.parentElement) loader.parentElement.style.display = 'none';
                }
            });
            // Muestra nuevamente los campos del modal
            
        } else {
            const mensajeLoader = document.querySelector('.loader-mensaje');
            if (mensajeLoader) {
                mensajeLoader.textContent = 'Asignando horario...';
            }else{
                alert("No se encontró el mensaje de carga.");
            }
            await asignarHorario(reservados,numeroHoja,correos);
            mensajeLoader.textContent = 'Reservando celdas en grilla...';
            await enviarCeldasReservadas(reservados,numeroHoja);
        }
    } catch (err) {
        
        Swal.fire({
            icon: 'error',
            title: 'Error de conexión',
            text: 'No se pudo validar los correos. Intenta nuevamente.'
        });
    }
}

// Asocia la función al botón enviar de la ventana modal (si existe)
const btnEnviar = document.querySelector('.enviar');
if (btnEnviar) {
    btnEnviar.addEventListener('click', async ()=>{
        const modalidad = document.querySelector('input[name="modalidad"]:checked').value;
        if (modalidad === 'grupal') {
            if (horariosSeleccionados.length < 2) {
                Swal.fire({
                    icon: 'error',
                    title: 'Selecciona al menos dos horarios',
                    text: 'En la modalidad grupal debes reservar por lo menos dos horas.'
                });
                return;
            }
            enviarCorreosIntegrantes();
        } else if (modalidad === 'individual') {
            window.location.hash = '';
            await asignarHorario(reservados,numeroHoja);
            await enviarCeldasReservadas(reservados,numeroHoja);
        }
    });
}

// Reinicia el modal al hacer clic en "cerrarVentana"
const btnCerrar = document.getElementById('cerrarVentanaModalidad');
if (btnCerrar) {
    btnCerrar.addEventListener('click', () => {
        // Reinicia el campo de cantidad de integrantes
        const numIntegrantes = document.getElementById('num-integrantes');
        if (numIntegrantes) {
            numIntegrantes.value = '';
        }
        // Oculta el contenedor de grupo
        const grupoContainer = document.getElementById('grupo-container');
        if (grupoContainer) {
            grupoContainer.style.display = 'none';
        }
        // Limpia los campos de integrantes
        const integrantesDiv = document.getElementById('integrantes');
        if (integrantesDiv) {
            integrantesDiv.innerHTML = '';
        }

        const modalidadRadios = document.querySelectorAll('input[name="modalidad"]');
        modalidadRadios.forEach(radio => radio.checked = false);
    });
}

function cargarLoader() {
        // Selecciona el modal
        const modal = document.querySelector('.modal');
    if (modal) {
            // Oculta todos los hijos excepto el loader (si existe)
            Array.from(modal.children).forEach(child => {
                if (!child.classList.contains('loader')) {
                    child.style.display = 'none';
                }
            });
            // Si ya existe el loader, lo muestra y actualiza el mensaje
            let loader = modal.querySelector('.loader');
            if (loader && loader.parentElement) {
                loader.parentElement.style.display = 'flex';
                const mensaje = loader.parentElement.querySelector('.loader-mensaje');
                if (mensaje) mensaje.textContent = 'Validando Correos...';
            }
            // Si no existe el loader, lo crea
            if (!loader) {
                loader = document.createElement('div');
                loader.className = 'loader';
                loader.style.cssText = 'margin: 40px auto; border: 8px solid #f3f3f3; border-top: 8px solid #3498db; border-radius: 50%; width: 60px; height: 60px; animation: spin 1s linear infinite;';
                // Contenedor para loader + mensaje
                const contenedor = document.createElement('div');
                contenedor.style.display = 'flex';
                contenedor.style.flexDirection = 'column';
                contenedor.style.alignItems = 'center';
                contenedor.appendChild(loader);
                // Mensaje debajo
                const mensaje = document.createElement('p');
                mensaje.classList.add('loader-mensaje');
                mensaje.textContent = 'Validando Correos...';
                mensaje.style.margin = '18px 0 0 0';
                mensaje.style.textAlign = 'center';
                mensaje.style.fontSize = '2.2rem';
                mensaje.style.fontWeight = 'bold';
                mensaje.style.color = '#ff9800';
                mensaje.style.textShadow = '0 1px 4px #fff, 0 0 1px #ff9800';
                mensaje.style.letterSpacing = '2px';
                mensaje.style.animation = 'loaderBlink 1s infinite';
                contenedor.appendChild(mensaje);
                modal.appendChild(contenedor);
                // Agrega animación CSS si no existe
                if (!document.getElementById('loader-style')) {
                    const style = document.createElement('style');
                    style.id = 'loader-style';
                    style.textContent = `
                        @keyframes spin {
                            0% { transform: rotate(0deg);}
                            100% { transform: rotate(360deg);}
                        }
                        @keyframes loaderBlink {
                            0%, 100% { opacity: 1; }
                            50% { opacity: 0.3; }
                        }
                    `;
                    document.head.appendChild(style);
                }
            }
        }
}