// cupones.js
//
// Lista de cupones de descuento habilitados.
// Cada cupón se valida contra DOS cosas al mismo tiempo:
//   1) el correo del alumno que está logueado (Alumno.correoElectronico)
//   2) el código que el alumno tipeó en el campo "cupón" de la página
// Si ambos coinciden con una entrada de esta lista, el cupón se considera válido.
//
// Campos de cada cupón:
//   - correo:    el correo del alumno al que pertenece el cupón (no distingue mayúsculas/minúsculas)
//   - codigo:    el código que el alumno debe ingresar (no distingue mayúsculas/minúsculas)
//   - descuento: un STRING que define el tipo y monto del descuento:
//       · Si contiene el símbolo "%" -> es un descuento PORCENTUAL sobre el monto a pagar.
//         Ej: "%25"  ->  25% de descuento sobre el total que se está por pagar.
//       · Si contiene el símbolo "$" -> es un descuento FIJO en pesos sobre el monto a pagar.
//         Ej: "$25"  ->  $25 de descuento sobre el total que se está por pagar.
//
// Notas:
//   - El descuento se aplica sobre lo que el alumno seleccionó pagar en ese momento
//     (una o varias clases, un pack, horas sueltas, etc.), no sobre el total general de deuda.
//   - Un descuento porcentual mayor a 100 se limita a 100%.
//   - Un descuento fijo nunca hace que el total sea negativo (como máximo, deja el total en $0).
//   - Un mismo alumno puede tener más de un cupón en la lista, cada uno con su propio código.

window.CUPONES = [
    // Ejemplos (borrar o reemplazar por los cupones reales):
    // { correo: "alumno@ejemplo.com",      codigo: "BIENVENIDO10", descuento: "%10" },
    // { correo: "otro.alumno@ejemplo.com", codigo: "DESCUENTO5",   descuento: "$5"  },
    { correo: "suaffine@gmail.com", codigo: "DESCUENTO10", descuento: "%10" },
];