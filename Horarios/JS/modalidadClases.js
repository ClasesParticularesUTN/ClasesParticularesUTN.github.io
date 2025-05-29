function mostrarCampos() {
    const grupoContainer = document.getElementById('grupo-container');
    const numIntegrantes = document.getElementById('num-integrantes');
    
    grupoContainer.style.display = 'flex';
    
    if (numIntegrantes.value) {
    
        generarCampos();
    
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
        if (modal) {
            // Oculta todos los hijos excepto el loader (si existe)
            Array.from(modal.children).forEach(child => {
                if (!child.classList.contains('loader')) {
                    child.style.display = 'none';
                }
            });
            // Si no existe el loader, lo crea
            let loader = modal.querySelector('.loader');
            if (!loader) {
                loader = document.createElement('div');
                loader.className = 'loader';
                loader.style.cssText = 'margin: 40px auto; border: 8px solid #f3f3f3; border-top: 8px solid #3498db; border-radius: 50%; width: 60px; height: 60px; animation: spin 1s linear infinite;';
                modal.appendChild(loader);
                // Agrega animación CSS si no existe
                if (!document.getElementById('loader-style')) {
                    const style = document.createElement('style');
                    style.id = 'loader-style';
                    style.textContent = `
                        @keyframes spin {
                            0% { transform: rotate(0deg);}
                            100% { transform: rotate(360deg);}
                        }
                    `;
                    document.head.appendChild(style);
                }
            } else {
                loader.style.display = 'block';
            }
        }
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
                    if (loader) loader.style.display = 'none';
                }
            });
            // Muestra nuevamente los campos del modal
            
        } else {
            await asignarHorario(reservados,numeroHoja,correos);
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
            enviarCorreosIntegrantes();
        }else if (modalidad === 'individual') {
            window.location.hash = '';
            await asignarHorario(reservados,numeroHoja);
            await enviarCeldasReservadas(reservados,numeroHoja);
        }
    });
}


