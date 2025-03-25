  const body = document.getElementById("content");
  const numalumno = document.getElementById("numeroalumno");
  const select = document.getElementById("filterDocto");
  let gradoSelected = 0;

  // Función para obtener los documentos
  const getDoctos = async () => {
    const url = `/api/doctos?numalumno=${numalumno.value}&grado=${gradoSelected}`;

    // Muestra un cargador centralizado mientras se obtienen los documentos
    body.innerHTML = `<div class="d-flex justify-content-center align-items-center" style="height: 100vh;">
      <div class="spinner-border text-primary" role="status"></div>
    </div>`;

    try {
      const res = await fetch(url);
      const data = await res.json();

      // Maneja el caso en que no haya documentos
      if (data.error) {
        body.innerHTML = `<div class="text-center text-danger"><h3>${data.error}</h3></div>`;
        return;
      }

      let content = "";

      // Si hay documentos, genera el contenido
      if (data.doctos && data.doctos.length > 0) {
        data.doctos.forEach((item) => {
          content += `
          <div class="col-md-3 col-lg-4 col-12 mb-4">
            <div class="card border-0 shadow-sm">
              <div class="card-body text-center">
                <img src="/imgs/pdf.png" alt="Documento PDF" class="img-fluid mb-2" style="width: 100px; height: auto; cursor: pointer;" onclick="viewPDF('${item.ID_DOCTO}')">
                <h5 class="card-title text-truncate">${item.ID_DOCTO}</h5>
                <p class="text-success"><strong>Entregado</strong></p>
                <button class="btn btn-info" onclick="viewDocumentDetails('${item.ID_DOCTO}')">Mostrar Información</button>
              </div>
            </div>
          </div>`;
        });
      } else {
        content = `<div class='text-center'>
          <h3>No hay documentos a mostrar</h3>
        </div>`;
      }

      body.innerHTML = content;
    } catch (error) {
      console.error("Error al obtener los documentos:", error);
      body.innerHTML = `<div class="text-center text-danger"><h3>Error al cargar documentos</h3></div>`;
    }
  };

  // Función para visualizar el PDF en un modal
  const viewPDF = (documentId) => {
    // Elimina cualquier modal existente antes de agregar uno nuevo
    const existingModal = document.getElementById('pdfModal');
    if (existingModal) {
      existingModal.remove();
    }

    const modalHTML = `
      <div class="modal fade" id="pdfModal" tabindex="-1" aria-labelledby="pdfModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-fullscreen"> <!-- Uso de modal-fullscreen para toda la pantalla -->
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="pdfModalLabel">Ver Documento: ${documentId}</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <!-- Usar iframe con un mejor estilo para que ocupe toda la pantalla -->
              <iframe src="/doctos/${documentId}" width="100%" height="100%" frameborder="0" style="object-fit: contain;"></iframe>
            </div>
          </div>
        </div>
      </div>`;

    // Agregar el modal al body y mostrarlo
    body.insertAdjacentHTML('beforeend', modalHTML);
    const modal = new bootstrap.Modal(document.getElementById('pdfModal'));
    modal.show();
  };

  // Función para obtener y mostrar los detalles del documento
  const viewDocumentDetails = async (documentId) => {
    try {
      const url = `/api/doctos/details?id=${documentId}`;
      const res = await fetch(url);
      const { documentDetails } = await res.json();

      if (!documentDetails) {
        body.innerHTML = `<div class="text-center text-danger"><h3>No se encontraron detalles para este documento</h3></div>`;
        return;
      }

      console.log(documentDetails); // Verifica que los detalles estén llegando

      // Modal HTML para mostrar los detalles del documento
      const modalHTML = `
        <div class="modal fade" id="documentDetailsModal" tabindex="-1" aria-labelledby="documentDetailsModalLabel" aria-hidden="true">
          <div class="modal-dialog modal-lg">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="documentDetailsModalLabel">Detalles del Documento: ${documentDetails.ID_DOCTO}</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                <p><strong>CLAVE:</strong> ${documentDetails.CLAVE}</p>
                <p><strong>RECEPCION:</strong> ${documentDetails.RECEPCION}</p>
                <p><strong>FECHA DE RECEPCIÓN:</strong> ${documentDetails.FECHA_RECEPCION}</p>
                <p><strong>USUARIO DE RECEPCIÓN:</strong> ${documentDetails.USERNAME_RECEPCION}</p>
                <p><strong>FECHA DEL DOCUMENTO:</strong> ${documentDetails.FECHA_DOCTO}</p>
                <p><strong>FECHA DE VIGENCIA:</strong> ${documentDetails.FECHA_VIGENCIA}</p>
                <p><strong>FECHA DE MODIFICACIÓN:</strong> ${documentDetails.FECHA_MODIFICACION ? documentDetails.FECHA_MODIFICACION : 'No modificada'}</p>
                <p><strong>USUARIO DE MODIFICACIÓN:</strong> ${documentDetails.USERNAME_MODIFICACION ? documentDetails.USERNAME_MODIFICACION : 'No modificada'}</p>
                <p><strong>FOLIO:</strong> ${documentDetails.FOLIO ? documentDetails.FOLIO : 'No disponible'}</p>
                <p><strong>NOMBRE DEL ARCHIVO:</strong> ${documentDetails.NOMBRE_ARCHIVO ? documentDetails.NOMBRE_ARCHIVO : 'No disponible'}</p>
                <p><strong>EXTENSIÓN DEL DOCUMENTO:</strong> ${documentDetails.EXT_DOCTO}</p>
              </div>
            </div>
          </div>
        </div>`;

      // Agregar el modal al body y mostrarlo
      body.insertAdjacentHTML('beforeend', modalHTML);
      const modal = new bootstrap.Modal(document.getElementById('documentDetailsModal'));
      modal.show();
    } catch (error) {
      console.error("Error al obtener los detalles del documento:", error);
      body.innerHTML = `<div class="text-center text-danger"><h3>Error al cargar detalles</h3></div>`;
    }
  };

  // Evento para manejar el cambio de grado
  select.addEventListener("change", (e) => {
    gradoSelected = e.target.value;
    getDoctos();
  });

