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

// Función principal
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

  try {
    // Realizar la solicitud a la API
    const res = await fetch(urlApi);
    if (!res.ok) {
      throw new Error(`Error en la solicitud: ${res.status} - ${res.statusText}`);
    }

    const { data } = await res.json();
    console.log("Datos recibidos:", data);

    // Construir el contenido de la tabla
    if (!data || data.length === 0) {
      table.innerHTML = "<tr><td colspan='5'>No hay datos disponibles</td></tr>";
    } else {
      let content = data
        .map((item, index) => {
          // Filtrar valores nulos o cero
          const calificacion = (item.CALIFICACION && item.CALIFICACION !== '0') ? item.CALIFICACION : "No disponible";
          const fecha = item.FECHA || "Fecha no disponible";
          const nombreCompleto = (item.PATERNO && item.MATERNO && item.NOMBRE) ? `${item.PATERNO} ${item.MATERNO} ${item.NOMBRE}` : "Nombre no disponible";
          const matricula = (item.MATRICULA && item.MATRICULA !== '0') ? item.MATRICULA : "Matrícula no disponible";

          // Si algún dato es nulo o cero, no lo mostramos en la tabla
          if (!calificacion || !matricula || !nombreCompleto || !fecha) {
            return ''; // Si algún campo está vacío o es 0, no generar la fila
          }

          return `
            <tr>
              <td>${index + 1}</td>
              <td>${nombreCompleto}</td>
              <td>${matricula}</td>
              <td>${calificacion}</td>
              <td>${fecha}</td>
            </tr>
          `;
        })
        .filter(item => item !== '') // Eliminar filas vacías
        .join("");


      // Si no hay contenido válido para mostrar, mostrar un mensaje adecuado
      if (content === "") {
        table.innerHTML = "<tr><td colspan='5'>No hay datos disponibles con la información actual</td></tr>";
      } else {
        table.innerHTML = content;
      }
    }
  } catch (error) {
    console.error("Error al cargar los datos:", error);
    table.innerHTML = "<tr><td colspan='5'>Error al cargar los datos</td></tr>";
  } finally {
    // Ocultar indicador de carga
    statusLoading.classList.add("d-none");
  }
}

// Manejar cambios en el selector
selectEval?.addEventListener("change", ({ target }) => {
  params["idEval"] = target.value;
  console.log("Nuevo idEval seleccionado:", target.value);
  main();
});

// Llamar a la función principal al cargar la página
main();
