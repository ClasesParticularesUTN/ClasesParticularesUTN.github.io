
// Seleccionamos todos los elementos que quieres animar
const elementos = document.querySelectorAll('.bloque');

// Creamos una instancia de Intersection Observer
const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // Cuando el elemento está en la vista, le agregamos las clases de animación
      entry.target.classList.remove('hidden');
      if(window.innerWidth < 1000) entry.target.classList.add('animate__backInDown'); // O cualquier animación de Animate.css que desees
      // Deja de observar el elemento una vez se ha animado
      observer.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.1  // El 50% del elemento debe estar visible para activar la animación
});

// Observamos cada elemento
elementos.forEach(elemento => {
  observer.observe(elemento);
});