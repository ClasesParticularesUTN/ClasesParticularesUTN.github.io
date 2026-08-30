/************************
 * ASIGNAR HORARIO (WRAPPER MULTI-DIA)
 ************************/
function testearRecordatorio() {
  enviarRecordatorioReserva(
    "Valentin",
    "3425993324",
    [
      "Lunes 13/07 10:00 hs",
      "Martes 14/07 10:00 hs"
    ]
  );
}


function asignarHorario(correo, celdas, num, integrantes, precio, nombre, principal, sinCorreo, codigoReserva) {

  const estaVacio = (v) =>
    v === undefined ||
    v === null ||
    v === '' ||
    (Array.isArray(v) && v.length === 0);

  if (estaVacio(correo))
    correo = "clasesparticularesutnfrsf@gmail.com";

  if (estaVacio(celdas))
    celdas = ["D3", "D4", "E3", "E4", "F3", "F4"];

  if (estaVacio(num))
    num = 0;

  if (estaVacio(integrantes))
    integrantes = [
      "clasesparticularesutnfrsf@gmail.com",
      "valedasilvacatela.vdc@gmail.com"
    ];

  if (estaVacio(precio))
    precio = 21000;

  if (estaVacio(nombre))
    nombre = "Juan";

  if (estaVacio(principal))
    principal = true;

  if (estaVacio(sinCorreo))
    sinCorreo = true;

  // =========================================================
  // CÓDIGO DE RESERVA
  // =========================================================
  // Si no se recibe un código, se genera uno.
  // Si ya se recibe, se reutiliza el mismo.
  if (estaVacio(codigoReserva)) {
    codigoReserva = generarSecuenciaAleatoria(10);
  }

  const grupos = agruparPorColumna(celdas);

  let resultados = [];
  let fechas = [];

  const precioPorHora =
    Math.round((precio / celdas.length) * 100) / 100;

  grupos.forEach(grupo => {

    const precioGrupo = grupo.length * precioPorHora;

    const resultado = asignarHorarioIndividual(
      correo,
      grupo,
      num,
      integrantes,
      precioGrupo,
      nombre,
      principal,
      sinCorreo,
      codigoReserva
    );

    resultados.push(resultado);
    fechas.push(resultado.fecha);
  });

  // Enviar UN SOLO WhatsApp al secundario
  if (!principal && resultados.length > 0) {
    enviarRecordatorioReserva(
      resultados[0].nombre,
      obtenerTelefono(correo),
      fechas
    );
  }

  return resultados;
}


/************************
 * ASIGNAR HORARIO ORIGINAL
 ************************/
function asignarHorarioIndividual(
  correo,
  celdas,
  num,
  integrantes,
  precio,
  nombre,
  principal,
  sinCorreo,
  codigoReserva
) {

  let hoja = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName("Valentin");

  hoja.getRange("C1:C9").setValues([
    ["correo: " + correo],
    ["celdas: " + JSON.stringify(celdas)],
    ["num: " + num],
    ["integrantes: " + JSON.stringify(integrantes)],
    ["precio: " + precio],
    ["nombre: " + nombre],
    ["principal: " + principal],
    ["sinCorreo: " + sinCorreo],
    ["codigoReserva: " + codigoReserva]
  ]);

  const ss = SpreadsheetApp.getActiveSpreadsheet();

  const indice = buscarCorreo(correo);

  const hojaAlumno = ss.getSheets()[indice];

  nombre = hojaAlumno.getRange("B1").getValue();

  horasAFavor(indice);
  dineroQueDebe(indice);

  let ultimaFila = hojaAlumno.getLastRow() + 1;

  const fecha = calcularDia(celdas, num);

  crearEventoCalendarioSoloYo(fecha, nombre);

  const horasDisponibles =
    Number(hojaAlumno.getRange("B10").getValue()) || 0;

  const horasReservadas = celdas.length;

  // Determinar si la reserva es Individual o Grupal
  const tipoClase =
    integrantes.length >= 2
      ? "Grupal"
      : "Individual";

  // Obtener el tipo de pack que tiene asignado el alumno
  const tipoPack = String(
    hojaAlumno.getRange("C13").getValue()
  ).trim();

  /*
   * Si C13 está vacío:
   *     no se aplica ninguna restricción de tipo.
   *
   * Si C13 tiene "Individual" o "Grupal":
   *     solamente puede utilizar ese tipo de pack.
   */

  const puedeUsarPack =
    tipoPack === "" ||
    tipoPack === tipoClase;

  /*
   * Hay deuda si:
   *
   * 1. No tiene suficientes horas disponibles
   * O
   * 2. El tipo de pack no coincide
   */

  const tieneDeuda =
    horasDisponibles < horasReservadas ||
    !puedeUsarPack;

  if (principal) {

    if (sinCorreo == false) {

      enviarCorreoIntegrantes(
        correo,
        fecha,
        integrantes,
        codigoReserva,
        tieneDeuda,
        precio,
        nombre
      );
    }

  } else {

    Logger.log("Nombre = " + nombre);

    enviarCorreoIntegrantesSecundarios(
      correo,
      fecha,
      integrantes,
      codigoReserva,
      tieneDeuda,
      tieneDeuda ? precio : undefined,
      nombre
    );
  }


  // =========================================================
  // ESCRIBIR FILA
  // =========================================================

  function escribirFila(fila, estado, celdasFila, precioFila) {

    copiarCelda(
      hojaAlumno,
      `C${fila}`
    );

    hojaAlumno
      .getRange(`A${fila}:D${fila}`)
      .setValues([[
        new Date(),
        fecha,
        estado,
        JSON.stringify(celdasFila)
      ]]);

    hojaAlumno
      .getRange(`E${fila}:I${fila}`)
      .setValues([[
        tipoClase,
        JSON.stringify(integrantes),

        // MISMO CÓDIGO PARA TODOS LOS INTEGRANTES
        codigoReserva,

        precioFila,
        num
      ]])
      .setFontColor("white");
  }


  // =========================================================
  // CLASIFICACIÓN DE PACK / DEBE
  // =========================================================

  // Caso 1:
  // No tiene horas disponibles.
  if (horasDisponibles <= 0) {

    escribirFila(
      ultimaFila,
      "Debe",
      celdas,
      precio
    );
  }

  // Caso 2:
  // Tiene horas disponibles, pero el tipo de pack
  // no coincide con el tipo de la reserva.
  else if (!puedeUsarPack) {

    escribirFila(
      ultimaFila,
      "Debe",
      celdas,
      precio
    );
  }

  // Caso 3:
  // El tipo coincide (o C13 está vacío)
  // y tiene suficientes horas para toda la reserva.
  else if (horasDisponibles >= horasReservadas) {

    escribirFila(
      ultimaFila,
      "Pack",
      celdas,
      precio
    );
  }

  // Caso 4:
  // Tiene horas suficientes para una parte
  // de la reserva.
  else {

    const arrayPack =
      celdas.slice(0, horasDisponibles);

    const arrayDebe =
      celdas.slice(horasDisponibles);

    const precioPorCelda =
      precio / celdas.length;

    const precioPack =
      Math.round(
        precioPorCelda * arrayPack.length
      );

    const precioDebe =
      precio - precioPack;

    escribirFila(
      ultimaFila,
      "Pack",
      arrayPack,
      precioPack
    );

    ultimaFila++;

    escribirFila(
      ultimaFila,
      "Debe",
      arrayDebe,
      precioDebe
    );
  }


  // =========================================================
  // REGISTRO
  // =========================================================

  agregarAlRegistro(
    correo,
    fecha,
    "Reserva de clase"
  );


  return {
    fecha,
    referencia: codigoReserva,
    nombre
  };
}

function enviarRecordatorioReserva(nombre, telefono, fechas, mensaje) {

  let telefonoLimpio = String(telefono).replace(/\D/g, '');

  if (!telefonoLimpio.startsWith('54')) {
    if (telefonoLimpio.startsWith('9')) {
      telefonoLimpio = '54' + telefonoLimpio;
    } else {
      telefonoLimpio = '549' + telefonoLimpio;
    }
  }

  // Reemplazar el nombre que ya viene dentro del mensaje
  // Ejemplo:
  // ¡Hola *Valentin*! 👋
  // ↓
  // ¡Hola *Juan*! 👋
  mensaje = mensaje.replace(
    /¡Hola \*.*?\*! 👋/,
    `¡Hola *${nombre}*! 👋`
  );

  const payload = {
    numero: telefonoLimpio,
    mensaje: mensaje
  };

  const opciones = {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };

  try {

    Logger.log(
      "Enviando petición tradicional a Render para: " + telefonoLimpio
    );

    UrlFetchApp.fetch(
      "https://servidorparawhatsapp.onrender.com/api/send-message",
      opciones
    );

    Logger.log("Petición procesada por el servidor.");

  } catch (error) {

    Logger.log(
      'Error al disparar el fetch: ' + error.toString()
    );

  }
}


function obtenerTelefono(correo) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const indice = buscarCorreo(correo);
  return ss.getSheets()[indice].getRange("B5").getValue();
}
/************************
 * CREAR EVENTO CALENDARIO
 ************************/
function crearEventoCalendarioSoloYo(fecha, nombre) {

  if (!fecha) return null;

  var inicio;

  if (fecha instanceof Date) {
    inicio = fecha;
  }
  else if (typeof fecha === "string") {
    var match = fecha.match(/(\d{2})\/(\d{2}) (\d{2}):(\d{2})/);

    if (!match) return null;

    var dia = parseInt(match[1], 10);
    var mes = parseInt(match[2], 10) - 1;
    var hora = parseInt(match[3], 10);
    var minuto = parseInt(match[4], 10);
    var anio = new Date().getFullYear();

    inicio = new Date(anio, mes, dia, hora, minuto);
  }
  else {
    return null;
  }

  if (isNaN(inicio.getTime())) return null;

  var fin = new Date(inicio.getTime() + 60 * 60 * 1000);

  var calendario = CalendarApp.getDefaultCalendar();

  var evento = calendario.createEvent(
    "Clase - " + (nombre || "SIN NOMBRE"),
    inicio,
    fin,
    {
      reminders: {
        useDefault: false,
        overrides: [{ method: "popup", minutes: 60 }]
      }
    }
  );

  return evento.getId();
}

/************************
 * COPIAR CELDA
 ************************/
function copiarCelda(hoja, celdaDestino) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const plantilla = ss.getSheets()[0];

  plantilla
    .getRange("C19")
    .copyTo(hoja.getRange(celdaDestino), { contentsOnly: false });
}

/************************
 * CALCULAR DIA Y HORA (FIX APLICADO)
 ************************/
function calcularDia(celdas, numeroHoja) {

  celdas = celdas ?? ["D9", "D10"];
  numeroHoja = numeroHoja ?? 0;

  // ✅ AHORA TOMA LA CELDA CON MENOR FILA
  const primeraCelda = calcularMenorPosicion(celdas);

  const letra = primeraCelda.match(/[A-Z]+/)[0];
  const numero = primeraCelda.match(/\d+/)[0];

  const hojaHorarios = SpreadsheetApp.openByUrl(
    "https://docs.google.com/spreadsheets/d/1ETX1I_WcSw765CUUp_ZooymUbEkJwbjj9eLXGQdbhyI/edit"
  ).getSheets()[numeroHoja];

  const fecha = hojaHorarios.getRange(`${letra}2`).getDisplayValue();
  const hora  = hojaHorarios.getRange(`A${numero}`).getDisplayValue();

  return `${fecha} ${hora}`;
}

/************************
 * MENOR POSICION
 ************************/
function calcularMenorPosicion(vector) {
  return vector.reduce((menor, actual) =>
    parseInt(actual.slice(1)) < parseInt(menor.slice(1)) ? actual : menor
  );
}

/************************
 * ASIGNAR GRUPAL
 ************************/
function asignarGrupal(celdas, num, correos) {

  if (celdas == undefined) {
    celdas = ["D9", "D10"];
    num = 0;
    correos = [
      "valedasilvacatela.vdc@gmail.com",
      "federicodasilvacatela@gmail.com"
    ];
  }

  const grupos = agruparPorColumna(celdas);
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const indices = buscarVariosCorreo(correos.slice());

  let fechas = [];

  grupos.forEach(grupo => {

    const fecha = calcularDia(grupo, num);
    fechas.push(fecha);

    indices.forEach(indice => {
      horasAFavor(indice);
      dineroQueDebe(indice);

      const hojaAlumno = ss.getSheets()[indice];
      const ultimaFila = hojaAlumno.getLastRow() + 1;

      hojaAlumno
        .getRange(`A${ultimaFila}:D${ultimaFila}`)
        .setValues([[
          new Date(),
          fecha,
          "",
          JSON.stringify(grupo)
        ]]);

      copiarCelda(hojaAlumno, `C${ultimaFila}`);

      const estado = hojaAlumno.getRange("B10").getValue() <= 0
        ? "Debe"
        : "Pack";

      hojaAlumno.getRange(`C${ultimaFila}`).setValue(estado);

      hojaAlumno
        .getRange(`E${ultimaFila}:F${ultimaFila}`)
        .setValues([["Grupal", JSON.stringify(correos)]])
        .setFontColor("white");
    });

  });

  return fechas;
}

/************************
 * SECUENCIA ALEATORIA
 ************************/
function generarSecuenciaAleatoria(longitud) {
  const caracteres = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let resultado = "";

  for (let i = 0; i < longitud; i++) {
    resultado += caracteres.charAt(
      Math.floor(Math.random() * caracteres.length)
    );
  }

  return resultado;
}

/************************
 * AGRUPAR POR COLUMNA
 ************************/
function agruparPorColumna(celdas) {
  const grupos = {};

  celdas.forEach(celda => {
    const columna = celda.match(/[A-Z]+/)[0];

    if (!grupos[columna]) {
      grupos[columna] = [];
    }

    grupos[columna].push(celda);
  });

  return Object.values(grupos);
}


