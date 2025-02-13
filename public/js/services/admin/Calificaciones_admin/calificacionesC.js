function mostrarCiclosFiltrados() {
  // Ver ciclos
  fetch('/api/ciclosAdmi')
    .then(response => response.json())
    .then(data => {
      let ciclosHTML = '';
      const bloqueados = JSON.parse(localStorage.getItem('ciclosBloqueados')) || {};

      data.forEach((ciclo, index) => {
        const bloqueado = bloqueados[ciclo.PERIODO] || false;

        ciclosHTML += `
          <tr id="fila-${index}">
            <td><input type="text" value="${ciclo.INICIAL}" id="inicial-${ciclo.PERIODO}" ${bloqueado ? 'disabled' : ''}/></td>
            <td><input type="text" value="${ciclo.FINAL}" id="final-${ciclo.PERIODO}" ${bloqueado ? 'disabled' : ''}/></td>
            <td><input type="text" value="${ciclo.PERIODO}" id="periodo-${ciclo.PERIODO}" ${bloqueado ? 'disabled' : ''}/></td>
            <td>${ciclo.FUNCION_CICLOS}</td>
            <td>
              <button onclick="toggleBloqueo('${ciclo.PERIODO}')">${bloqueado ? 'Desbloquear' : 'Bloquear'}</button>
            </td>
          </tr>`;
      });

      document.getElementById('ciclosContainer').innerHTML = ciclosHTML;
    })
    .catch(error => {
      console.error('Error al obtener los datos de la API:', error.message);
      document.getElementById('ciclosContainer').innerHTML = '<tr><td colspan="5">Error al obtener los datos de la API</td></tr>';
    });
}

function toggleBloqueo(periodo) {
  let bloqueados = JSON.parse(localStorage.getItem('ciclosBloqueados')) || {};
  
  // Actualizar el estado del bloqueo localmente
  if (bloqueados[periodo]) {
    delete bloqueados[periodo];
  } else {
    bloqueados[periodo] = true;
  }

  // Guardar el estado actualizado del bloqueo en localStorage
  localStorage.setItem('ciclosBloqueados', JSON.stringify(bloqueados));

  // Volver a cargar la tabla con los cambios (sin enviar la actualización al servidor)
  mostrarCiclosFiltrados();
}
