const selectEval = document.getElementById("idPlan");
const statusLoading = document.getElementById("loading");
const table = document.getElementById("table-content");

const asigName = document.getElementById("asig");
const grupoName = document.getElementById("grupo");

const url = new URL(location.href);
const searchQuery = url.searchParams;

let params = {
  idPlan: searchQuery.get("idPlan"),
  claveAsig: searchQuery.get("claveAsig"),
  nombreAsig: searchQuery.get("nombreAsig"),
  grupo: searchQuery.get("grupo"),
  idEtapa: searchQuery.get("idEtapa"),
  idEval: "A",
  inicial: searchQuery.get("inicial"),
  final: searchQuery.get("final"),
  periodo: searchQuery.get("periodo"),
};

grupoName.innerHTML = `Grupo: ${params.grupo}`;
asigName.innerHTML = `Asignatura: ${params.nombreAsig}`;

async function main() {
  table.innerHTML = ""; // Limpia la tabla
  statusLoading.classList.remove("d-none"); // Muestra el spinner de carga

  let urlApi = "/api/calificaciones?";
  Object.keys(params).forEach((item) => {
    urlApi += `${item}=${params[item]}&`;
  });

  console.log("Consultando:", urlApi); // Depuración: URL consultada

  try {
    const res = await fetch(urlApi);
    if (!res.ok) {
      throw new Error(`Error en la respuesta del servidor: ${res.status}`);
    }

    const { data } = await res.json();
    console.log("Datos recibidos:", data); // Depuración: Datos recibidos

    if (!data || data.length === 0) {
      table.innerHTML = `<tr><td colspan="4" class="text-center">No hay datos disponibles</td></tr>`;
      return;
    }

    let content = "";
    data.forEach((item, index) => {
      // Verificar si el nombre existe aunque no haya calificación
      const nombre = `${item.PATERNO || ""} ${item.MATERNO || ""} ${item.NOMBRE || "Sin nombre"}`;
      const matricula = item.MATRICULA || "Sin matrícula";
      let calificacion = item.CALIFICACION;

      // Mostrar '0' cuando la calificación es 0, o "Sin calificación" si no está definida
      const displayCalificacion = (calificacion === 0 || calificacion) ? calificacion : "Sin calificación";

      console.log(`Procesando fila ${index + 1}:`, item); // Depuración: Cada fila

      content += "<tr>";
      content += `<td>${index + 1}</td>`; // Número de fila
      content += `<td>${nombre}</td>`; // Nombre completo
      content += `<td>${matricula}</td>`; // Matrícula
      content += `<td>${displayCalificacion}</td>`; // Calificación
      content += "</tr>";
    });

    table.innerHTML = content; // Agrega las filas a la tabla
  } catch (error) {
    console.error("Error al obtener los datos:", error);
    table.innerHTML = `<tr><td colspan="4" class="text-center text-danger">Error al cargar los datos</td></tr>`;
  } finally {
    statusLoading.classList.add("d-none"); // Oculta el spinner de carga
  }
}

// Escuchar cambios en el select para filtrar por evaluación
selectEval.addEventListener("change", ({ target }) => {
  params["idEval"] = target.value;
  console.log("Cambiando evaluación a:", params["idEval"]); // Depuración: Cambio de evaluación
  main();
});

main();
