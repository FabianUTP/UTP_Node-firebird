"use strict";

const table = document.getElementById("table-container");
const inputSearch = document.getElementById("buscar");
const load = document.getElementById("load");

let limit = 40;
let skip = 0;
let search = "";
let orderBy = "numeroalumno";
let sort = "asc";
let alumnosLength = 0;

inputSearch.addEventListener("input", debounce(() => {
  search = inputSearch.value;
  skip = 0; // Reinicia la paginación
  getAlumnos();
}));

// Hace la llamada a la API
const getAlumnos = async () => {
  // Vacia la tabla en caso que ya tenga datos
  table.innerHTML = "";
  load.style.display = "block";

  // Convertir el valor de búsqueda a mayúsculas
  const upperCaseSearch = search.toUpperCase();

  // Filtrar por nombre y apellido únicamente
  const url = `api/alumnos?limit=${limit}&skip=${skip}&search=${upperCaseSearch}&orderBy=${orderBy}&sort=${sort}`;
  
  try {
    const res = await fetch(url);
    const { alumnos } = await res.json();

    load.style.display = "none";

    if (!alumnos || alumnos.length === 0) {
      table.innerHTML = "<tr><td colspan='9' style='text-align: center;'>No se encontraron resultados</td></tr>";
      return;
    }

    let content = "";
    const status = {
      A: "Activo",
      E: "Egresado",
      BA: "Baja",
      S: "Aspirantes"
    };

    alumnos.forEach((item) => {
      // Filtrar solo los alumnos que contengan el término de búsqueda en su nombre o apellido
      if (
        item.PATERNO.toUpperCase().includes(upperCaseSearch) || 
        item.MATERNO.toUpperCase().includes(upperCaseSearch) ||
        item.NOMBRE.toUpperCase().includes(upperCaseSearch)
      ) {
        content += `<tr onclick="window.location.href='/alumnos/${item.MATRICULA}'">`;
        content += `<td>${item.NUMEROALUMNO}</td>`;
        content += `<td>${item.PATERNO} ${item.MATERNO}</td>`;
        content += `<td>${item.NOMBRE}</td>`;
        content += `<td>${item.MATRICULA}</td>`;
        content += `<td>${status[item.STATUS] ?? ""}</td>`;
        content += `<td>${item.NIVEL}</td>`;

        // TÍTULO LICENCIATURA
        const proyectoObs = (item.PROYECTO_OBS && item.PROYECTO_OBS !== 0) ? item.PROYECTO_OBS : "";
        const obsProyectoLic = (item.OBS_PROYECTO_LIC && item.OBS_PROYECTO_LIC !== 0) ? item.OBS_PROYECTO_LIC : "";

        content += `<td>${proyectoObs}</td>`;
        content += `<td>${obsProyectoLic}</td>`;
        content += "</tr>";
      }
    });

    table.innerHTML = content;
    alumnosLength = alumnos.length;
  } catch (error) {
    console.error("Error al obtener los datos:", error);
    load.style.display = "none";
  }
};

// Funciones para manejar orden y paginación
const handleOrder = (by) => {
  orderBy = by;
  getAlumnos();
};

const handleSort = (by) => {
  sort = by;
  getAlumnos();
};

const prev = () => {
  if (skip >= limit) {
    skip -= limit;
    getAlumnos();
  }
};

const next = () => {
  if (alumnosLength >= limit) {
    skip += limit;
    getAlumnos();
  }
};

// Inicializa la carga de alumnos
getAlumnos();

// Función de debouncing para optimizar la búsqueda
function debounce(func, wait = 500) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}
