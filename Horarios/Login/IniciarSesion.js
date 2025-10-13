class Persona {
  constructor(nombre, contrasenia, correo) {
    this.nombre = nombre;
    this.contrasenia = contrasenia;
    this.correo = correo;
  }
  obtenerNombre() {
    return this.nombre;
  }
  obtenerApellido() {
    return this.apellido;
  }
  obtenerCorreo() {
    return this.correo;
  }
}

var Alumno;

// Selecciones flexibles para el nuevo HTML `Login2.html`
const form = document.querySelector('form');
const emailInput = form ? form.querySelector('input[type="email"]') : document.querySelector('input[type="email"]');
const maskedInput = document.getElementById('contraFondo') || (form && form.querySelector('input[type="password"]')) || (form && form.querySelector('input[type="text"]'));
const submitBtn = form ? form.querySelector('button[type="submit"]') : document.querySelector('button[type="submit"]') || document.querySelector('.btn');
const loader = document.querySelector('.contenedorLoader');

// Evita fallos si no existen elementos esperados
if (!form) {
  console.error('No se encontró <form> en la página. IniciarSesion.js necesita un formulario.');
}

// Desactivar autocomplete en los inputs (compatibilidad con comportamiento previo)
document.querySelectorAll('input').forEach(input => {
  input.setAttribute('autocomplete', 'off');
});

// Rellenar con el último correo si existe en localStorage
try {
  const ultimo = localStorage.getItem('UltimoCorreo');
  if (ultimo && emailInput) {
    emailInput.value = JSON.parse(ultimo);
  }
} catch (e) {
  console.warn('No se pudo leer UltimoCorreo de localStorage:', e);
}

// Manejo del enmascarado de contraseña en el input #contraFondo
let realPassword = '';
if (maskedInput) {
  // Asegurar que el campo muestre solo '*' y que guardemos la contraseña real en `realPassword`.
  maskedInput.addEventListener('input', (event) => {
    try {
      const itype = event.inputType;
      // Insert text (incluye pegar)
      if (itype && (itype === 'insertText' || itype === 'insertFromPaste' || itype === 'insertCompositionText')) {
        const data = event.data != null ? event.data : maskedInput.value.replace(/\*/g, '');
        // Si el navegador pegó la cadena completa en el campo, `data` puede ser null; tomar diferencia
        if (data && data.length > 0) {
          realPassword += data;
        } else {
          // fallback: si el valor del campo contiene más caracteres que los '*' que tenía, intentamos deducirlos
          // No es perfecto, pero evitamos perder la entrada en la mayoría de casos.
          // No hacemos nada especial aquí.
        }
      } else if (itype === 'deleteContentBackward') {
        // Suprimir último carácter
        realPassword = realPassword.slice(0, -1);
      } else if (itype === 'deleteContentForward') {
        // También manejar delete hacia adelante conservadoramente
        realPassword = realPassword.slice(0, -1);
      }
      // Actualizar display a la misma cantidad de estrellas
      maskedInput.value = '*'.repeat(realPassword.length);
    } catch (e) {
      console.error('Error manejando input de contraseña:', e);
    }
  });

  // Soporte para teclas especiales (por ejemplo: suprimir con tecla Backspace fuera del input event)
  maskedInput.addEventListener('keydown', (ev) => {
    if (ev.key === 'Backspace') {
      // Dejar que el evento input se encargue, pero sincronizamos por si acaso
      // realPassword = realPassword.slice(0, -1);
      // no hacer nada adicional aquí para evitar duplicados
    }
  });
}

// Manejar envío del formulario (compatible con Login2.html)
if (form) {
  form.addEventListener('submit', function (event) {
    event.preventDefault();

    const correo = emailInput ? emailInput.value.trim().toLowerCase() : '';
    const contrasenia = realPassword || '';

    if (!correo) {
      if (typeof Swal !== 'undefined') {
        Swal.fire({ icon: 'error', title: 'Email requerido', text: 'Por favor ingresa tu correo electrónico.' });
      } else {
        alert('Por favor ingresa tu correo electrónico.');
      }
      return;
    }

    if (!contrasenia) {
      if (typeof Swal !== 'undefined') {
        Swal.fire({ icon: 'error', title: 'Contraseña requerida', text: 'Por favor ingresa tu contraseña.' });
      } else {
        alert('Por favor ingresa tu contraseña.');
      }
      return;
    }

    if (typeof URLUsuarios === 'undefined') {
      console.error('La variable URLUsuarios no está definida. No se puede enviar la petición.');
      if (typeof Swal !== 'undefined') {
        Swal.fire({ icon: 'error', title: 'Error', text: 'Configuración de URL usuarios faltante.' });
      }
      return;
    }

    const urlFinal = URLUsuarios + '?correo=' + encodeURIComponent(correo) + '&contrasenia=' + encodeURIComponent(contrasenia) + '&funcion=validarUsuario';
  // Guardar último correo ingresado
  try { if (correo && typeof correo === 'string') localStorage.setItem('UltimoCorreo', JSON.stringify(correo)); } catch(e) { console.warn('No se pudo guardar UltimoCorreo:', e); }
    // No preguntar: por defecto recordamos al usuario 7 días
    enviar(urlFinal);
  });
}

// Función de envío (fetch) con manejos flexibles de UI
function enviar(urlFinal) {
  const body = document.querySelector('body');
  if (body) body.style.cursor = 'wait';
  if (submitBtn) {
    submitBtn.style.cursor = 'wait';
    submitBtn.disabled = true;
  }
  if (loader) loader.style.display = 'flex';

  fetch(urlFinal).then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    if (data.sesion) {
      const personaJSON = JSON.stringify(data);
      sessionStorage.setItem('persona', personaJSON);
      // Guardamos siempre una copia persistente con expiración de 7 días
      try {
        const now = Date.now();
        const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
        const payload = {
          persona: data,
          expiresAt: now + sevenDaysMs
        };
        localStorage.setItem('personaPersistente', JSON.stringify(payload));
      } catch (e) {
        console.warn('No se pudo guardar personaPersistente:', e);
      }
      if (data.nombre) localStorage.setItem('Nombre', JSON.stringify(data.nombre));
      if (data.apellido) localStorage.setItem('Apellido', JSON.stringify(data.apellido));
      // Guardar último correo tras login exitoso
      try { if (correo && typeof correo === 'string') localStorage.setItem('UltimoCorreo', JSON.stringify(correo)); } catch(e) { console.warn('No se pudo guardar UltimoCorreo tras login:', e); }
      console.log(urlFinal)
      // Redirigir: mantener la lógica original con excepciones conocidas
      if (document.referrer !== '' && document.referrer !== 'https://clasesparticularesutn.com.ar/Horarios/Registro/Registro.html' && document.referrer !== 'http://127.0.0.1:5501/Horarios/Login/Login2.html') {
        window.location.href = document.referrer;
      } else {
        window.location.href = '../index.html';
      }
    } else {
      if (typeof Swal !== 'undefined') {
        Swal.fire({ icon: 'error', title: 'Error', text: data.error });
      } else {
        alert(data.error || 'Error en el inicio de sesión');
      }
    }
  })
  .catch(error => {
    console.error('There was a problem with the fetch operation:', error);
    if (typeof Swal !== 'undefined') {
      Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo conectar con el servidor.' });
    }
  })
  .finally(() => {
    if (body) body.style.cursor = 'default';
    if (submitBtn) {
      submitBtn.style.cursor = 'default';
      submitBtn.disabled = false;
    }
    if (loader) loader.style.display = 'none';
  });
}

// Simular Enter para compatibilidad: si el usuario presiona Enter fuera del form
document.addEventListener('keydown', function(event) {
  if (event.key === 'Enter') {
    // Si hay un elemento enfocado que no sea un textarea, permitimos el submit normal
    const active = document.activeElement;
    if (active && active.tagName !== 'TEXTAREA') {
      if (submitBtn) submitBtn.click();
    }
  }
});

console.log(document.referrer);

