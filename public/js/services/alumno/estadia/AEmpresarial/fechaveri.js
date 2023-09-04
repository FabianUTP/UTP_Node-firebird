function validarFechaCartaLiberacion() {
    var fechaTermino = new Date(document.getElementById("fechaTerminoEstadiaEmpresa").value);
    var fechaCartaLiberacionInput = document.getElementById("fechaCartaLiberacion");
    var fechaActual = new Date();

    if (fechaActual >= fechaTermino) {
      fechaCartaLiberacionInput.disabled = false;
    } else {
      fechaCartaLiberacionInput.disabled = true;
    }
  }