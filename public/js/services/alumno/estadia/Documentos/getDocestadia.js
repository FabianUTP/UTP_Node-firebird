document.addEventListener('DOMContentLoaded', function() {
  const numeroalumno = document.getElementById('numeroalumno').value;
  const filterDocto = document.getElementById('filterDocto');

  filterDocto.addEventListener('change', function() {
    const cuatrimestre = filterDocto.value;

    axios.get(`/api/edoctos?grado=${cuatrimestre}&numalumno=${numeroalumno}`)
      .then(response => {
        const doctos = response.data.doctos;
        const contentContainer = document.getElementById('content');

        // Limpia el contenido existente
        contentContainer.innerHTML = '';

        // Agrega los documentos al contenedor
        doctos.forEach(docto => {
          const doctoElement = document.createElement('div');
          doctoElement.textContent = docto.nombreDocumento; // Ajusta esto según tus datos
          contentContainer.appendChild(doctoElement);
        });
      })
      .catch(error => {
        console.error('Error al obtener los documentos:', error);
      });
  });
});
