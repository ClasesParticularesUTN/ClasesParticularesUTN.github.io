function verificarCorreos(correos) {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var hojas = ss.getSheets();
    var correosEnSistema = [];

    // Recorre todas las hojas a partir de la segunda
    for (var i = 1; i < hojas.length; i++) {
        var correo = hojas[i].getRange('B4').getValue();
        if (correo) {
            correosEnSistema.push(correo.toString().trim().toLowerCase());
        }
    }

    // Busca los correos que no están en el sistema
    var noEncontrados = correos.filter(function(correo) {
        return correosEnSistema.indexOf(correo.toString().trim().toLowerCase()) === -1;
    });

    if (noEncontrados.length > 0) {
        return { error: "Los siguientes correos no están en el sistema: " + noEncontrados.join(', ') };
    } else {
        return { error: false };
    }
}