// Configuración de pagos personalizados por correo.
// Agregá uno o varios pares correo/precio.
// IMPORTANTE: este archivo se carga en el navegador (no es secreto).

// Formato:
// { correo: "alguien@mail.com", precio: 1234, titulo: "Opcional", referencia: "opcional" }
//
// - correo: email exacto (se normaliza a minúsculas y sin espacios)
// - precio: número (monto a cobrar)
// - titulo: texto que se muestra como item (opcional)
// - referencia: string para identificar el pago (opcional)

window.PERSONALIZADO_PAGOS = [
  // Ejemplo:
  // { correo: "alumno@ejemplo.com", precio: 15000, titulo: "Pago especial", referencia: "especial_abril" },
  { correo: "juanma.2000@hotmail.com", precio: 83000, titulo: "Pack Examen Individual", referencia: "pack_examen_individual" },
];

