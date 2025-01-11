const table = document.getElementById("table-content");
const boton = document.getElementById("buscar");
const grupoFilter = document.getElementById("grupoFilter");
const asignaturaFilter = document.getElementById("asignaturaFilter");

let page = 1;
let search = "";
let selectedGroup = "";
let selectedAsignatura = "";

// Obtener el ID del profesor desde el valor oculto en el HTML
const idProfesor = document.getElementById("idprofesor").value;

// Función para cargar los datos de las asignaciones
async function getAsignaciones() {
  let url = `/api/asignaciones?page=${page}&search=${search}&idProfesor=${idProfesor}&grupo=${selectedGroup}&asignatura=${selectedAsignatura}`;
  console.log("Solicitando datos de:", url);

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error en la solicitud: ${response.status}`);
    }

    const api = await response.json();
    console.log("Datos recibidos:", api);

    // Verificar si hay datos
    if (!api.data || api.data.length === 0) {
      table.innerHTML = `
        <tr>
          <td colspan="4" style="text-align: center; font-weight: bold;">
            No hay asignaciones disponibles
          </td>
        </tr>`;
    } else {
      // Rellenar el filtro de grupo con los grupos disponibles
      fillGroupFilter(api.groups);
      
      // Rellenar el filtro de asignatura con las asignaturas disponibles
      fillAsignaturaFilter(api.asignaturas);

      let content = api.data
        .map((item, index) => `
          <tr>
            <td>${index + 1}</td>
            <td>${item.CODIGO}</td>
            <td>${item.NOMBRE_ASIGNATURA}</td>
            <td>${item.GRUPO}</td>
          </tr>
        `)
        .join("");

      table.innerHTML = content;
    }
  } catch (error) {
    console.error("Error al cargar los datos:", error);
    table.innerHTML = `
      <tr>
        <td colspan="4" style="text-align: center; color: red;">
          Ocurrió un error al cargar las asignaciones
        </td>
      </tr>`;
  }
}

// Función para rellenar el selector de grupos
function fillGroupFilter(groups) {
  let groupOptions = `<option value="">Todos los Grupos</option>`;
  groups.forEach(group => {
    groupOptions += `<option value="${group}">${group}</option>`;
  });
  grupoFilter.innerHTML = groupOptions;
}

// Función para rellenar el selector de asignaturas
function fillAsignaturaFilter(asignaturas) {
  let asignaturaOptions = `<option value="">Todas las Asignaturas</option>`;
  asignaturas.forEach(asignatura => {
    asignaturaOptions += `<option value="${asignatura}">${asignatura}</option>`;
  });
  asignaturaFilter.innerHTML = asignaturaOptions;
}

// Función para manejar la búsqueda con debounce
function debounce(func, delay = 300) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), delay);
  };
}

// Event listener para el campo de búsqueda
boton.addEventListener(
  "input",
  debounce((event) => {
    search = event.target.value;
    page = 1;  // Resetear la página a la 1
    getAsignaciones();
  })
);

// Event listener para el filtro de grupos
grupoFilter.addEventListener("change", (event) => {
  selectedGroup = event.target.value;
  page = 1; // Resetear la página
  getAsignaciones();
});

// Event listener para el filtro de asignaturas
asignaturaFilter.addEventListener("change", (event) => {
  selectedAsignatura = event.target.value;
  page = 1; // Resetear la página
  getAsignaciones();
});

// Función para manejar la navegación hacia la página anterior
function onPrev() {
  if (page > 1) {
    page--;
    getAsignaciones();
  }
}

// Función para manejar la navegación hacia la siguiente página
function onNext() {
  page++;
  getAsignaciones();
}

// Cargar los datos cuando la página se carga
getAsignaciones();
