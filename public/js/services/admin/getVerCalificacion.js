// Elementos HTML
const elements = {
  selectEval: document.getElementById("idPlan"),
  statusLoading: document.getElementById("loading"),
  table: document.getElementById("table-content"),
  asigName: document.getElementById("asig"),
  grupoName: document.getElementById("grupo"),
};

// Obtener parámetros de la URL con valores predeterminados
const searchQuery = new URLSearchParams(location.search);
const params = {
  idEval: "A",
  idPlan: searchQuery.get("idPlan"),
  claveAsig: searchQuery.get("claveAsig"),
  nombreAsig: searchQuery.get("nombreAsig"),
  grupo: searchQuery.get("grupo"),
  idEtapa: searchQuery.get("idEtapa"),
  inicial: searchQuery.get("inicial"),
  final: searchQuery.get("final"),
  periodo: searchQuery.get("periodo"),
};

// Ajustar la interfaz para dispositivos móviles
function adjustForMobile() {
  if (window.innerWidth <= 768) {
    document.querySelector("table").classList.add("table-responsive");
  }
}

// Mostrar datos en el DOM
function updateDOM() {
  elements.grupoName.textContent = `Grupo: ${params.grupo || "No definido"}`;
  elements.asigName.textContent = `Asignatura: ${params.nombreAsig || "No definida"}`;
  fetchAndDisplayData();
}

// Obtener y mostrar datos en la tabla
async function fetchAndDisplayData() {
  elements.table.innerHTML = "";
  elements.statusLoading.classList.remove("d-none");

  try {
    const res = await fetch(`/api/calificaciones?${new URLSearchParams(params)}`);
    if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);

    const { data } = await res.json();

    if (!data.length) {
      elements.table.innerHTML = "<tr><td colspan='4' class='text-center'>No se encontraron calificaciones.</td></tr>";
      return;
    }

    // Procesar y ordenar los datos por nombre
    const processedData = data
      .map(({ PATERNO = "", MATERNO = "", NOMBRE = "", MATRICULA = "Matrícula no disponible", CALIFICACION = "No disponible" }) => ({
        nombre: `${PATERNO} ${MATERNO} ${NOMBRE}`.trim().toUpperCase(),
        matricula: MATRICULA,
        calificacion: CALIFICACION,
      }))
      .sort((a, b) => a.nombre.localeCompare(b.nombre)); // Ordenar alfabéticamente

    elements.table.innerHTML = processedData
      .map(
        (item, index) => `
          <tr>
            <td>${index + 1}</td>
            <td>${item.nombre}</td>
            <td>${item.matricula}</td>
            <td>${item.calificacion}</td>
          </tr>`
      )
      .join("");
  } catch (error) {
    console.error("Error al cargar datos:", error);
    elements.table.innerHTML = "<tr><td colspan='4' class='text-center'>Error al cargar los datos. Inténtelo más tarde.</td></tr>";
  } finally {
    elements.statusLoading.classList.add("d-none");
  }
}

// Evento para cambiar evaluación
elements.selectEval?.addEventListener("change", ({ target }) => {
  params.idEval = target.value;
  fetchAndDisplayData();
});

// Inicializar
adjustForMobile();
updateDOM();
window.addEventListener("resize", adjustForMobile);
