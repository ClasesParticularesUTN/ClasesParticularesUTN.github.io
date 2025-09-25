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
    
    // Actualizar información de precios
    actualizarInformacionPrecios();
}

function calcularPrecio() {
    const modalidad = document.querySelector('input[name="modalidad"]:checked');
    const cantidadHoras = horariosSeleccionados.length;
    const numIntegrantes = parseInt(document.getElementById('num-integrantes').value) || 1;
    
    if (!modalidad || cantidadHoras === 0) {
        return null;
    }
    
    let precioPorHora;
    let total;
    
    if (modalidad.value === 'individual') {
        // Individual: $5000 por 1 hora, $4500 por más de 1 hora
        precioPorHora = cantidadHoras === 1 ? 5000 : 4500;
        total = precioPorHora * cantidadHoras;
        
        return {
            modalidad: 'individual',
            cantidadHoras: cantidadHoras,
            precioPorHora: precioPorHora,
            total: total,
            descripcion: cantidadHoras === 1 ? 
                `1 hora: $${precioPorHora}` : 
                `${cantidadHoras} horas: $${precioPorHora} por hora`
        };
    } else if (modalidad.value === 'grupal') {
        // Grupal: $3000 por hora por persona
        precioPorHora = 3000;
        total = precioPorHora * cantidadHoras * numIntegrantes;
        
        return {
            modalidad: 'grupal',
            cantidadHoras: cantidadHoras,
            numIntegrantes: numIntegrantes,
            precioPorHora: precioPorHora,
            total: total,
            descripcion: `${cantidadHoras} horas × ${numIntegrantes} personas × $${precioPorHora} = $${total}`
        };
    }
    
    return null;
}
let  precioInfo;
function actualizarInformacionPrecios() {
    const precioContainer = document.getElementById('precio-container');
    const precioTotalSimple = document.getElementById('precio-total-simple');
    const precioDetalleCompleto = document.getElementById('precio-detalle-completo');
    const verDetalleBtn = document.getElementById('ver-detalle-btn');
    
    if (!precioContainer || !precioTotalSimple || !precioDetalleCompleto || !verDetalleBtn) return;
    
    precioInfo = calcularPrecio();
    
    if (precioInfo && Alumno.horasAFavor <= 0) {
        precioContainer.style.display = 'block';
        
        // Mostrar solo el total de forma simple
        precioTotalSimple.innerHTML = `Total: $${precioInfo.total}`;
        
        // Preparar el detalle completo (oculto por defecto)
        let detalleHtml = `<div class="precio-resumen">`;
        detalleHtml += `<p><strong>Modalidad:</strong> ${precioInfo.modalidad === 'individual' ? 'Individual' : 'Grupal'}</p>`;
        detalleHtml += `<p><strong>Horas seleccionadas:</strong> ${precioInfo.cantidadHoras}</p>`;
        
        if (precioInfo.modalidad === 'grupal') {
            detalleHtml += `<p><strong>Integrantes:</strong> ${precioInfo.numIntegrantes}</p>`;
        }
        
        detalleHtml += `<p><strong>Precio por hora:</strong> $${precioInfo.precioPorHora}</p>`;
        detalleHtml += `<p><strong>Detalle:</strong> ${precioInfo.descripcion}</p>`;
        detalleHtml += `<p class="precio-total"><strong>Total: $${precioInfo.total}</strong></p>`;
        detalleHtml += `</div>`;
        
        precioDetalleCompleto.innerHTML = detalleHtml;
        
        // Ocultar el detalle por defecto
        precioDetalleCompleto.style.display = 'none';
        verDetalleBtn.textContent = 'Ver detalle';
    } else {
        precioContainer.style.display = 'none';
    }
}

function toggleDetallePrecio() {
    const precioDetalleCompleto = document.getElementById('precio-detalle-completo');
    const verDetalleBtn = document.getElementById('ver-detalle-btn');
    
    if (!precioDetalleCompleto || !verDetalleBtn) return;
    
    if (precioDetalleCompleto.style.display === 'none') {
        precioDetalleCompleto.style.display = 'block';
        verDetalleBtn.textContent = 'Ocultar detalle';
    } else {
        precioDetalleCompleto.style.display = 'none';
        verDetalleBtn.textContent = 'Ver detalle';
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
    
    // Actualizar información de precios cuando cambie el número de integrantes
    actualizarInformacionPrecios();
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
    }else if(horariosSeleccionados.length < 2){
        Swal.fire({
            icon: 'error',
            title: 'Horas insuficientes',
            text: 'Las clases grupales tienen un minimo de dos horas.'
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
        const response = await fetch(url);
        const data = await response.json();
        if (data.error && data.error !== false) {
            let mensaje = calcularMensaje(data);
            let titulo = data.faltantes? 'Todos los integrantes deben estar registrados en la pagina':'Deben dinero';
            Swal.fire({
                icon: 'error',
                title: titulo,
                html: mensaje
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
            if(Alumno.fechaPago != "NULL" && Alumno.clasesAFavor <= 0 && JSON.parse(localStorage.getItem("fechaPago")) != Alumno.fechaPago){
                
            }else {
                }
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
            enviarCorreosIntegrantes();
        }else if (modalidad === 'individual') {
            if(seleccionoUnGrupal){
                Swal.fire({
                    icon: 'error',
                    title: 'Horario no disponible',
                    text: 'El horario seleccionado es exclusivo para clases grupales. Por favor, elige otro horario para la modalidad individual.'
                });
                return;
            }else{
                if(Alumno.fechaPago != "NULL" && Alumno.horasAFavor <= 0 && localStorage.getItem("fechaPago") != Alumno.fechaPago){
                    localStorage.setItem("fechaPago",Alumno.fechaPago);
                    Swal.fire({
                    title: 'Atención',
                    text: 'Su pack de clases ya se gastó. Puede renovarlo o pagar cada clase individualmente. Recuerde revisar la sección de precios.',
                    icon: 'warning',
                    showDenyButton: true,
                    confirmButtonText: 'Aceptar',
                    denyButtonText: 'Ir a Precios',
                    allowOutsideClick: false,
                    focusConfirm: true
                }).then(async (result) => {
                    if (result.isDenied) {
                        // Redirige a la ruta /Precios
                        window.location.href = '/Precios';
                    }else{
                        
                    }
                    
                });
            }else{
                 window.location.hash = '';
                await asignarHorario(reservados,numeroHoja);
                await enviarCeldasReservadas(reservados,numeroHoja);
            }
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
        
        // Oculta la información de precios
        const precioContainer = document.getElementById('precio-container');
        const precioDetalleCompleto = document.getElementById('precio-detalle-completo');
        const verDetalleBtn = document.getElementById('ver-detalle-btn');
        
        if (precioContainer) {
            precioContainer.style.display = 'none';
        }
        if (precioDetalleCompleto) {
            precioDetalleCompleto.style.display = 'none';
        }
        if (verDetalleBtn) {
            verDetalleBtn.textContent = 'Ver detalle';
        }
    });
}

// Actualizar precios cuando se abre la ventana modal
window.addEventListener('hashchange', function() {
    if (window.location.hash === '#VentanaModal') {
        // Pequeño delay para asegurar que el modal esté completamente visible
        setTimeout(() => {
            actualizarInformacionPrecios();
        }, 100);
    }
});

// También actualizar cuando se carga la página si ya está en la ventana modal
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.hash === '#VentanaModal') {
        setTimeout(() => {
            actualizarInformacionPrecios();
        }, 100);
    }
});

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

function calcularMensaje(data) {
    let mensaje = '';
    if(data.faltantes){
        mensaje += data.faltantes;
        mensaje += '<br><br>';
    }
    if(data.deudores != false){
        mensaje += data.deudores;
    }
    return mensaje;
}

document.addEventListener('keydown', function(e) {
        // Solo si el modal está visible
        const modal = document.querySelector('.modal');
        if (!modal || modal.style.display === 'none') return;
        // Si el foco está en un input de correo de integrante
        if (e.key === 'Enter' && document.activeElement && document.activeElement.matches('input[id^="correo-integrante-"]')) {
            e.preventDefault();
            btnEnviar.click();
        }
    });

