// calificaciones De Estadias

function mostrarCiclosFiltrados() {
    fetch('/api/ciclosAdmi')
      .then(response => response.json())
      .then(data => {
        let ciclosHTML = '';
        const bloqueados = JSON.parse(localStorage.getItem('ciclosBloqueados')) || {};
  
        // Filtramos solo el primer ciclo del primer periodo (PERIODO = 1)
        const primerCicloPeriodo = data.filter(ciclo => ciclo.PERIODO === 3)[0]; // Tomamos el primer ciclo del periodo 1
  
        if (primerCicloPeriodo) {
          const bloqueado = bloqueados[primerCicloPeriodo.PERIODO] || false;
  
          ciclosHTML += `<tr id="fila-0" class="${bloqueado ? 'bloqueado' : ''}">
            <td>${primerCicloPeriodo.INICIAL}</td>
            <td>${primerCicloPeriodo.FINAL}</td>
            <td>${primerCicloPeriodo.PERIODO}</td>
            <td>${primerCicloPeriodo.FUNCION_CICLOS}</td>
            <td>
              <span class="icono-bloqueo" onclick="bloquearPeriodo('${primerCicloPeriodo.PERIODO}')">${bloqueado ? '🔒' : '🔓'}</span>
            </td>
          </tr>`;
  
          document.getElementById('ciclosContainer').innerHTML = ciclosHTML;
        } else {
          document.getElementById('ciclosContainer').innerHTML = '<tr><td colspan="5">No se encontraron ciclos con el periodo 1.</td></tr>';
        }
      })
      .catch(error => {
        console.error('Error al obtener los datos de la API:', error.message);
        document.getElementById('ciclosContainer').innerHTML = '<tr><td colspan="5">Error al obtener los datos de la API</td></tr>';
      });
  }
  
  
  
  function bloquearPeriodo(periodo) {
    let bloqueados = JSON.parse(localStorage.getItem('ciclosBloqueados')) || {};
  
    // Si el periodo está bloqueado, lo desbloqueamos
    if (bloqueados[periodo]) {
      delete bloqueados[periodo];
      console.log(`Ciclo con periodo ${periodo} desbloqueado.`); // Imprimir mensaje en consola cuando se desbloquea
    } else {
      // Si el periodo no está bloqueado, lo bloqueamos
      bloqueados[periodo] = true;
      console.log(`Ciclo con periodo ${periodo} bloqueado.`); // Imprimir mensaje en consola cuando se bloquea
    }
  
    // Actualizamos el almacenamiento local
    localStorage.setItem('ciclosBloqueados', JSON.stringify(bloqueados));
  
    mostrarCiclosFiltrados();
  }
  
  
  function bloquearTodo() {
    const filas = document.querySelectorAll('tbody tr');
    let bloqueados = {};
  
    filas.forEach(fila => {
      const periodo = fila.querySelector('td:nth-child(3)').textContent; // Obtener el periodo de la fila
      bloqueados[periodo] = true; // Bloqueamos todos los ciclos de ese periodo
    });
  
    localStorage.setItem('ciclosBloqueados', JSON.stringify(bloqueados));
    mostrarCiclosFiltrados(); // Recargamos para reflejar los cambios
  }


  function desbloquearTodo() {
    let bloqueados = {};
  
    localStorage.setItem('ciclosBloqueados', JSON.stringify(bloqueados));
    mostrarCiclosFiltrados(); // Recargamos para reflejar los cambios
  }
  