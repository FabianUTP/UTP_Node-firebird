$(document).ready(function () {
  $('#btnAgregarEmpresa').click(function () {
    // Establecer los valores en el contenido del formulario del modal
    $('#modalContent').html(`
      <div class="card card-wide ">
        <div class="card-body">
        <h4><label for="idEmpresa">ID Empresa:</label></h4>
        <input type="text" class="form-control" id="idEmpresa">
          <h4 class="card-title">Datos Generales</h4>
          <table class="table">
            <tr>
              <th>Nombre:</th>
              <td><input type="text" class="form-control" id="nombreEmpresa"></td>
            </tr>
            <tr>
              <th>RFC:</th>
              <td><input type="text" class="form-control" id="rfcEmpresa"></td>
            </tr>
            <tr>
              <th>Teléfono:</th>
              <td><input type="text" class="form-control" id="telefonoEmpresa"></td>
            </tr>
            <tr>
              <th>Correo:</th>
              <td><input type="text" class="form-control" id="correoEmpresa"></td>
            </tr>
          </table>
        </div>
      </div>
      <div class="card card-wide">
        <div class="card-body">
          <h4 class="card-title">Dirección</h4>
          <table class="table">
            <tr>
              <th>Domicilio:</th>
              <td><input type="text" class="form-control" id="domicilioEmpresa"></td>
            </tr>
            <tr>
              <th>Número Ext:</th>
              <td><input type="text" class="form-control" id="numExtEmpresa"></td>
            </tr>
            <tr>
              <th>Número Int:</th>
              <td><input type="text" class="form-control" id="numIntEmpresa"></td>
            </tr>
            <tr>
              <th>Colonia:</th>
              <td><input type="text" class="form-control" id="coloniaEmpresa"></td>
            </tr>
            <tr>
              <th>C.P.:</th>
              <td><input type="text" class="form-control" id="cpEmpresa"></td>
            </tr>
            <tr>
              <th>Localidad:</th>
              <td><input type="text" class="form-control" id="localidadEmpresa"></td>
            </tr>
            <tr>
              <th>Municipio:</th>
              <td><input type="text" class="form-control" id="municipioEmpresa"></td>
            </tr>
            <tr>
              <th>Estado:</th>
              <td><input type="text" class="form-control" id="estadoEmpresa"></td>
            </tr>
          </table>
        </div>
      </div>
    `);

    $('#modalAgregarEmpresa').modal('show');
  });

 // Agregar el evento click para el botón "Guardar" del modal de agregar empresa
 $('#modalAgregarEmpresa').on('click', '.btnGuardarEmpresa', function () {
  // Obtener los valores de los campos de texto del modal
  var nombreEmpresa = $('#nombreEmpresa').val();
  var rfcEmpresa = $('#rfcEmpresa').val();
  var telefonoEmpresa = $('#telefonoEmpresa').val();
  var correoEmpresa = $('#correoEmpresa').val();
  var domicilioEmpresa = $('#domicilioEmpresa').val();
  var numExtEmpresa = $('#numExtEmpresa').val();
  var numIntEmpresa = $('#numIntEmpresa').val();
  var coloniaEmpresa = $('#coloniaEmpresa').val();
  var cpEmpresa = $('#cpEmpresa').val();
  var localidadEmpresa = $('#localidadEmpresa').val();
  var municipioEmpresa = $('#municipioEmpresa').val();
  var estadoEmpresa = $('#estadoEmpresa').val();

  // Crear un objeto con los datos de la empresa
  var empresa = {
    NOMBRE_EMPRESA: nombreEmpresa,
    CEDULA_FISCAL_EMPRESA: rfcEmpresa,
    TELEFONO1_EMPRESA: telefonoEmpresa,
    EMAIL: correoEmpresa,
    DOMICILIO_EMPRESA: domicilioEmpresa,
    NUMEXT_EMPRESA: numExtEmpresa,
    NUMINT_EMPRESA: numIntEmpresa,
    COLONIA_EMPRESA: coloniaEmpresa,
    CP_EMPRESA: cpEmpresa,
    LOCALIDAD_EMPRESA: localidadEmpresa,
    CIUDAD_EMPRESA: municipioEmpresa,
    ESTADO_EMPRESA: estadoEmpresa
  };

  // Enviar la solicitud para guardar la empresa
  guardarEmpresa(empresa);
});

function guardarEmpresa(empresa) {
  $.ajax({
    url: '/api/empresas',
    type: 'POST',
    data: JSON.stringify(empresa),
    contentType: 'application/json',
    success: function (response) {
      console.log('Empresa guardada exitosamente');
      // Realiza las acciones necesarias después de guardar la empresa, como mostrar un mensaje de éxito, actualizar la interfaz, etc.
    },
    error: function (error) {
      console.error('Error al guardar la empresa:', error.responseText);
      // Realiza las acciones necesarias en caso de error, como mostrar un mensaje de error, realizar una redirección, etc.
    }
  });
}
});