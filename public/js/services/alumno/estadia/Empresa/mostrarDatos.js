$(document).ready(function () {
    $('#selectEmpresa').change(function () {
        var empresaId = $(this).val();
        if (empresaId !== 'opcion1') {
            $.ajax({
                url: '/alumno/estadia/empresas', // Ruta hacia el controlador EstadiaController.js
                method: 'POST',
                data: { empresaId: empresaId },
                success: function (response) {
                    // Procesar la respuesta del servidor
                    if (response.success) {
                        // Rellenar los campos del formulario con los datos recibidos
                        $('#nombre').val(response.data.NOMBRE_EMPRESA);
                        $('#rfc').val(response.data.rfc);
                        $('#domicilio').val(response.data.domicilio);
                        $('#numeroExt').val(response.data.numeroExt);
                        $('#numeroInt').val(response.data.numeroInt);
                        $('#colonia').val(response.data.colonia);
                        $('#cp').val(response.data.cp);
                        $('#localidad').val(response.data.localidad);
                        $('#municipio').val(response.data.municipio);
                        $('#estado').val(response.data.estado);
                        $('#telefono').val(response.data.telefono);
                        $('#correo').val(response.data.correo);
                        // Continuar con los demás campos del formulario
                    } else {
                        // Manejo de error si es necesario
                    }
                },
                error: function (xhr, status, error) {
                    // Manejo de error si ocurre algún problema con la solicitud AJAX
                }
            });
        }
    });
});
