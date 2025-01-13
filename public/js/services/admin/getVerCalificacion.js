// Elementos HTML necesarios
const selectEval = document.getElementById("idPlan");
const statusLoading = document.getElementById("loading");
const table = document.getElementById("table-content");
const asigName = document.getElementById("asig");
const grupoName = document.getElementById("grupo");

// Extraer parámetros desde la URL
const url = new URL(location.href);
const searchQuery = url.searchParams;

// Inicializar parámetros
let params = {
  idPlan: searchQuery.get("idPlan"),
  claveAsig: searchQuery.get("claveAsig"),
  nombreAsig: searchQuery.get("nombreAsig"),
  grupo: searchQuery.get("grupo"),
  idEtapa: searchQuery.get("idEtapa"),
  idEval: "A", // Valor inicial
  inicial: searchQuery.get("inicial"),
  final: searchQuery.get("final"),
  periodo: searchQuery.get("periodo"),
};

// Mostrar el grupo y la asignatura en el DOM
grupoName.innerHTML = `Grupo: ${params.grupo || "No definido"}`;
asigName.innerHTML = `Asignatura: ${params.nombreAsig || "No definida"}`;

// Función para actualizar la tabla con los datos de la API
async function main() {
  console.log("Ejecutando función main...");
  
  // Limpiar tabla y mostrar indicador de carga
  table.innerHTML = "";
  statusLoading.classList.remove("d-none");

  // Construir la URL para la API
  let urlApi = "/api/calificaciones?";
  Object.entries(params).forEach(([key, value]) => {
    if (value) urlApi += `${key}=${value}&`;
  });

  console.log("URL generada para la API:", urlApi);
// error
  try {
    // Realizar la solicitud a la API
    const res = await fetch(urlApi);
    if (!res.ok) {
      throw new Error(`Error en la solicitud: ${res.status} - ${res.statusText}`);
    }

    const { data } = await res.json();
    console.log("Datos recibidos:", data);

    // Si no hay datos de calificación o calificaciones son "0", "null", o no definidas
    if (!data || data.length === 0) {
      // En este caso, los nombres y matrículas pueden estar disponibles
      const noDataMessage = "<tr><td colspan='5'>No hay Datos:</td></tr>";
      table.innerHTML = noDataMessage;
    } else {
      // Construir el contenido de la tabla
      let content = data
        .map((item, index) => {
          // Obtener nombre completo del alumno
          const nombre = `${item.PATERNO} ${item.MATERNO} ${item.NOMBRE}`;
          const matricula = item.MATRICULA || "Matrícula no disponible";

          // Verificar si la calificación es válida, si no mostrar "No disponible"
          const calificacion = (item.CALIFICACION && item.CALIFICACION !== "0" && item.CALIFICACION !== null) ? item.CALIFICACION : "";

          // Si la calificación es vacía, no mostrarla
          const calificacionCell = calificacion === "" ? "" : calificacion;

          return `
            <tr>
              <td>${index + 1}</td>
              <td>${nombre}</td>
              <td>${matricula}</td>
              <td>${calificacionCell || ""}</td>
              <td>${item.FECHA || ""}</td>
            </tr>
          `;
        })
        .join("");
      table.innerHTML = content;
    }
  } catch (error) {
    console.error("Error al cargar los datos:", error);
    table.innerHTML = "<tr><td colspan='5'>Error al cargar los datos</td></tr>";
  } finally {
    // Ocultar indicador de carga
    statusLoading.classList.add("d-none");
  }
}

// Detectar cambios en los parámetros de la URL
function updateParamsFromURL() {
  // Actualizar los parámetros con los valores más recientes de la URL
  params.inicial = searchQuery.get("inicial");
  params.final = searchQuery.get("final");
  params.periodo = searchQuery.get("periodo");

  // Mostrar los nuevos valores en el DOM
  grupoName.innerHTML = `Grupo: ${params.grupo || "No definido"}`;
  asigName.innerHTML = `Asignatura: ${params.nombreAsig || "No definida"}`;

  // Llamar nuevamente a la función principal para actualizar los datos
  main();
}

// Llamar a la función de actualización al cargar la página
updateParamsFromURL();

// Manejar cambios en el parámetro `idPlan`
selectEval?.addEventListener("change", ({ target }) => {
  params["idEval"] = target.value;
  console.log("Nuevo idEval seleccionado:", target.value);
  main();
});
