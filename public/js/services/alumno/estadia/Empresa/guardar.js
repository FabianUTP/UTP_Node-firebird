$(document).ready(function() {
  var esEdicion = false;
  var selectedEmpresaId = null; // Variable para almacenar el ID de la empresa seleccionada

  // Controlador de eventos para el botón "Editar"
  $('#btnEditar').click(function() {
    // Habilitar los campos de entrada para la edición
    $('input, select, textarea').removeAttr('readonly');

    // Mostrar el botón "Guardar" y ocultar el botón "Editar"
    $('#btnGuardar').show();
    $('#btnEditar').hide();

    // Establecer la variable esEdicion como true
    esEdicion = true;
  });

  // Controlador de eventos para el botón "Guardar"
  $('#btnGuardar').click(function() {
    // Verificar si es una edición o un nuevo registro
    if (esEdicion) {
      // Realizar acción de edición
      // ...
    } else {
      // Realizar acción de guardado
      // ...
    }
  });

  // Controlador de eventos para el cuadro de selección de empresas
  $('#selectEmpresa').change(function() {
    // Obtener el valor seleccionado (ID de la empresa)
    selectedEmpresaId = $(this).val();

    // Si se selecciona la opción "No existe en catálogo", mostrar el botón "Agregar Empresa"
    if (selectedEmpresaId === 'opcion1') {
      $('#btnAgregarEmpresa').show();
    } else {
      // Si se selecciona una empresa existente, hacer la solicitud para obtener los datos de la empresa
      obtenerDatosEmpresa(selectedEmpresaId);
    }
  });

  // Controlador de eventos para el botón "Agregar Empresa"
  $('#btnAgregarEmpresa').click(function() {
    // Lógica para mostrar el formulario de agregar empresa
    // ...
  });

  // Función para obtener los datos de la empresa seleccionada por su ID
  function obtenerDatosEmpresa(id_empresa) {
    $.ajax({
      url: `/api/empleados/empresas/${id_empresa}`, // Ruta de la API para obtener una empresa por su ID
      type: 'GET',
      success: function(data) {
        // Rellenar los campos del formulario con los datos recibidos
        $('#nombre').val(data.nombreempresa);
        $('#rfc').val(data.rfc);
        $('#domicilio').val(data.domicilio);
        $('#numeroExt').val(data.numeroext);
        $('#numeroInt').val(data.numeroint);
        $('#colonia').val(data.colonia);
        $('#cp').val(data.cp);
        $('#localidad').val(data.localidad);
        $('#municipio').val(data.municipio);
        $('#estado').val(data.estado);
        $('#telefono').val(data.telefono);
        $('#correo').val(data.correo);
      },
      error: function(err) {
        console.error(err);
      }
    });
  }
});
