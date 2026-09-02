function onOpen() {

  var ss = SpreadsheetApp.getActiveSpreadsheet();

  var hojaLogs = ss.getSheetByName("Logs");

  if (!hojaLogs) return;

  // Ocultar columnas B y C
  hojaLogs.hideColumns(2, 2);

  Utilities.sleep(10000); // 10 segundos

  actualizar();
}
function doGet(e) {
  let correo, contrasenia, resultado = "", codigo, nombre, apellido;
  if (e == undefined) {
    e = {
      parameter: {
        funcion: "cancelarReserva",
        correo: "valedasilvacatela.vdc@gmail.com",
        codigo: "mjbbiPoOzt",
        admin: true
      }
    };
  }
  
            SpreadsheetApp.getActiveSpreadsheet()
        .getSheetByName("Valentin")
        .getRange("C2")
        .setValue(JSON.stringify(e));
  


  switch (e.parameter.funcion) {
    case "validarUsuario":
      correo = e.parameter.correo;
      contrasenia = e.parameter.contrasenia;
            SpreadsheetApp.getActiveSpreadsheet()
        .getSheetByName("Valentin")
        .getRange("C2")
        .setValue(JSON.stringify([correo, contrasenia]));
      let referrer = e.parameter.referrer;
      resultado = validarUsuario(correo, contrasenia,referrer);
      break;

    case "horariosPorDar":
      resultado = horariosPorDar();
      break;

    case "recuperarContrasenia":
      correo = e.parameter.correo;
      codigo = e.parameter.codigo;
      resultado = enviarCodigo(correo, codigo);
      break;

    case "modificarContrasenia":
      correo = e.parameter.correo;
      contrasenia = e.parameter.contrasenia;
      resultado = modificarContrasenia(correo, contrasenia);
      break;

    case "obtenerArchivos":
      nombre = e.parameter.nombre;
      apellido = e.parameter.apellido;
      resultado = obtenerArchivos(nombre + " " + apellido);
      break;

    case "obtenerAlumnos":
      resultado = obtenerAlumnos();
      break;

    case "horariosCompleto":
      let indiceHoja = parseInt(e.parameter.indiceHoja);
      resultado = horariosCompleto(indiceHoja + 2);
      break;

    case "verificarCorreos":
      let correos = e.parameter.correos;
      resultado = verificarCorreos(JSON.parse(correos));
      break;

    case "horariosPorPagar":
      resultado = horariosPorPagar();
      break;

    case "devolverFicha":
      nombre = e.parameter.nombre;
      apellido = e.parameter.apellido;
      resultado = devolverFicha(nombre, apellido);
      break;
    case "devolverDeuda":
      correo = e.parameter.correo;
      resultado = devolverDeuda(correo);
      break;
    case "cancelarReserva":
        try {
          resultado = cancelarReserva(e.parameter.correo, e.parameter.codigo, e.parameter.admin);
        } catch (err) {
          resultado = { exito: false, mensaje: String(err.message || err) };
        }
        break;
    case "adminListarAlumnos":
      resultado = adminListarAlumnos_(e.parameter.adminToken);
      break;
    case "adminObtenerAlumno":
      resultado = adminObtenerAlumno_(e.parameter.hoja, e.parameter.adminToken);
      break;
    case "adminListarLogs":
      resultado = adminListarLogs_(e.parameter.adminToken);
      break;
    case "codigoRespaldo":
  try {
    // Usá el mismo correo que “avisar”, o pasalo en e.parameter.correo / e.parameter.destinatario
    const CORREO_AVISO = 'valedasilvacatela.vdc@gmail.com';

    const correoDestino = CORREO_AVISO;

    const ruta = e.parameter.ruta || '';
    const ip = e.parameter.ip || '';
    const userAgent = e.parameter.userAgent || '';
    // en tu servidor ahora mismo el código fijo no se envía; igual mostramos 159246
    resultado = enviarCorreoCodigoRespaldoCSS({
      correoDestino,
      codigo: 'Respaldo',
      ruta,
      ip,
      userAgent
    });
  } catch (err) {
    resultado = { exito: false, mensaje: String(err && err.message ? err.message : err) };
  }
  break;
    default:
      resultado = { error: "Función no definida" + e.parameter.funcion };
  }
  Logger.log(resultado);
  return ContentService.createTextOutput(JSON.stringify(resultado)).setMimeType(ContentService.MimeType.JSON);
}


function actualizar(i) {
  if(i == undefined){    
      let cantidad = SpreadsheetApp.getActiveSpreadsheet().getSheets().length;
      for (let i = 2; i < 10; i++) {
        horasAFavor(i);
        dineroQueDebe(i);
      }
  }else{
    horasAFavor(i);
    dineroQueDebe(i);
  }
}


function onSelectionChange(e) {
  var hoja = e.range.getSheet();
  var props = PropertiesService.getUserProperties();

  var nombreActual = hoja.getName();
  var nombreAnterior = props.getProperty("ultimaHoja");

  if (nombreActual !== nombreAnterior) {
    funcion(nombreActual); // 👈 solo el nombre

    props.setProperty("ultimaHoja", nombreActual);
  }
}
function doPost(e) {
  let datos = {};

  try {
    if (e && e.postData && e.postData.contents) {
      datos = JSON.parse(e.postData.contents);
    }
  } catch (error) {
    datos = {};
  }

  if (!datos || typeof datos !== 'object') {
    datos = {};
  }

  if (e && e.parameter && !datos.funcion) {
    datos.funcion = e.parameter.funcion || datos.funcion;
  }

  if (typeof datos.mensaje === 'undefined') {
    datos.mensaje = '';
  }

  if (typeof datos.sinCorreo === 'undefined') {
    datos.sinCorreo = false;
  }

  SpreadsheetApp.getActiveSpreadsheet()
    .getSheetByName("Valentin")
    .getRange("C2")
    .setValue(JSON.stringify(datos));

  if (datos.funcion === "adminApi") {
    const outAdmin = adminApiDispatch_(datos);

    return ContentService
      .createTextOutput(JSON.stringify(outAdmin))
      .setMimeType(ContentService.MimeType.JSON);
  }

  let resultado;

  agregarAlRegistro(JSON.stringify(datos));
  SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Valentin").getRange("C1").setValue(JSON.stringify(datos));

  try {
    switch (datos.funcion) {
      case "asignarHorario": {
        const mensajeWhatsApp = typeof datos.mensaje === 'string' ? datos.mensaje : '';
        let fechas = [];
        // Código de reserva compartido por todos los integrantes de una
        // misma reserva grupal. Se completa con el código que genera
        // asignarHorario() para el principal (índice 0), y se reutiliza
        // para el resto de los integrantes en vez de dejar que cada uno
        // genere el suyo.
        let codigoReservaCompartido;

        (datos.integrantes || []).forEach((correo, indice) => {
          let res = asignarHorario(
            correo,
            datos.celdas,
            datos.numeroHoja,
            datos.integrantes,
            datos.precio,
            datos.nombre,
            indice == 0,
            !!datos.sinCorreo,
            // 9° = codigoReserva: undefined para el principal (se genera
            // uno nuevo) y ya definido para el resto (se reutiliza).
            codigoReservaCompartido,
            // 10° = mensajePersonalizado: el texto de WhatsApp. Este es
            // un parámetro propio y separado de codigoReserva — NUNCA
            // reusar la posición 9 para esto, fue justamente el bug que
            // rompía la planilla.
            mensajeWhatsApp
          );

          if (!Array.isArray(res)) {
            res = [res];
          }

          res.forEach(r => {
            if (r && r.fecha) fechas.push(r.fecha);
            if (r && r.referencia && !codigoReservaCompartido) {
              codigoReservaCompartido = r.referencia;
            }
          });
        });

        console.log(fechas, datos.persona, datos.integrantes);
        enviarCorreo(fechas, datos.persona, datos.integrantes, datos.materia);
        break;
      }

      case "agregarAlumno": {
        resultado = agregarAlumno(datos.datosAlumnos);
        break;
      }

      case "registrarPago": {
        registrarPago(datos.persona, datos.horario);
        break;
      }

      case "subirCodigo": {
        subirCodigo(datos);
        break;
      }

      case "enviarWhatsApp": {
        resultado = {
          ok: true,
          recibido: true,
          numero: datos.numero || '',
          mensaje: datos.mensaje || ''
        };
        break;
      }

      case "registrarPagoAutomatico": {
        const referenciasPack = [
          "horas_sueltas",
          "individual_packExamen",
          "individual_packMateria",
          "grupal_packExamen",
          "grupal_packMateria"
        ];

        resultado = referenciasPack.some(x =>
          (datos.referencia || []).includes(x) ||
          (
            datos.referencia &&
            datos.referencia[0] &&
            datos.referencia[0].tipo &&
            datos.referencia[0].tipo.includes(x)
          )
        )
          ? habilitarPack(datos.correo, datos.referencia)
          : registrarPagoAutomatico(
              datos.correo,
              datos.referencia,
              datos.monto
            );

        break;
      }

      case "cargarContras": {
        agregarAlRegistro(
          datos.correo,
          (datos.contra || []).join(", "),
          "Iniciar Sesion"
        );
        break;
      }

      case "enviarCorreo": {
        enviarCorreoCualquiera(
          datos.asunto,
          datos.texto
        );
        break;
      }
    }
  } catch (err) {
    Logger.log(err);
    resultado = {
      ok: false,
      exito: false,
      mensaje: String(err && err.message ? err.message : err),
      funcion: datos.funcion || 'sin_funcion'
    };
  }

  if (resultado !== undefined) {
    return ContentService
      .createTextOutput(JSON.stringify(resultado))
      .setMimeType(ContentService.MimeType.JSON);
  }

  return ContentService.createTextOutput(JSON.stringify({ ok: true, recibido: true, funcion: datos.funcion || 'sin_funcion' }))
    .setMimeType(ContentService.MimeType.JSON);
}

function escribirMensaje(mensaje = "mensaje",celda = "B1"){
        SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Plantilla").getRange(celda).setValue(mensaje);

}