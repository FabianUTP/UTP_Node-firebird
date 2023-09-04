// getDataFromAPI.js
document.getElementById('selectEmpresa').addEventListener('change', function () {
    const selectedEmpresaIndex = this.value;
    if (selectedEmpresaIndex !== 'opcion1') {
      obtenerDatosEmpresa(selectedEmpresaIndex);
    }
  });
  
  async function obtenerDatosEmpresa(selectedEmpresaIndex) {
    try {
      const response = await fetch(`/api/empleados/empresas/${selectedEmpresaIndex}`);
      if (!response.ok) {
        throw new Error('Error al obtener los datos de la empresa');
      }
      const empresa = await response.json();
      mostrarDatosEmpresa(empresa);
    } catch (error) {
      console.error(error);
      // Puedes mostrar un mensaje de error en la vista si la empresa no se pudo obtener
      
    }
  }
  
  function mostrarDatosEmpresa(empresa) {
    // Rellenar los campos del formulario con los datos de la empresa recibida
    document.getElementById('nombre').value = empresa.nombreempresa;
    document.getElementById('rfc').value = empresa.rfc;
    document.getElementById('domicilio').value = empresa.domicilio;
    document.getElementById('numeroExt').value = empresa.numeroext;
    document.getElementById('numeroInt').value = empresa.numeroint;
    document.getElementById('colonia').value = empresa.colonia;
    document.getElementById('cp').value = empresa.cp;
    document.getElementById('localidad').value = empresa.localidad;
    document.getElementById('municipio').value = empresa.ciudad_empresa; // Aquí corregimos el campo del municipio
    document.getElementById('estado').value = empresa.estado_empresa; // Aquí corregimos el campo del estado
    document.getElementById('telefono').value = empresa.telefono1_empresa; // Aquí corregimos el campo del teléfono
    document.getElementById('correo').value = empresa.email; // Aquí corregimos el campo del correo electrónico
  }
  