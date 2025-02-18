"use strict";

const table = document.getElementById("table-container");
const inputSearch = document.getElementById("buscar");
const load = document.getElementById("load");

let limit = 20;
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

    alumnos.forEach((item, i) => {
      content += `<tr onclick="window.location.href='/alumnos/${item.MATRICULA}'">`;
      content += `<td>${item.NUMEROALUMNO}</td>`;
      content += `<td>${item.PATERNO} ${item.MATERNO}</td>`;
      content += `<td>${item.NOMBRE}</td>`;
      content += `<td>${item.MATRICULA}</td>`;
      content += `<td>${status[item.STATUS] ?? ""}</td>`;
      content += `<td>${item.NIVEL}</td>`;
      // TÍTULO LICENCIATURA
      content += `<td>${item.FOLIO_TITLIC ?? ""}</td>`; // Folio Titulación
      content += `<td>${item.LIBRO_TITLIC ?? ""}</td>`; // Libro Titulación
      content += `<td>${item.FOJA_TITLIC ?? ""}</td>`;  // Foja Titulación
      // CERTIFICADO LICENCIATURA
      content += `<td>${item.FOLIO_CERLIC ?? ""}</td>`; // Folio Certificado
      content += `<td>${item.LIBRO_CERLIC ?? ""}</td>`; // Libro Certificado
      content += `<td>${item.FOJA_CERLIC ?? ""}</td>`;  // Foja Certificado
      // ACTA EXENCIÓN LICENCENCIATURA
      content += `<td>${item.FOLIO_AEXLIC ?? ""}</td>`; // Folio Acta Exención
      content += `<td>${item.LIBRO_AEXLIC ?? ""}</td>`; // Libro Acta Exención
      content += `<td>${item.FOJA_AEXLIC ?? ""}</td>`;  // Foja Acta Exención
      //SERVICIO SOCIAL LICENCIATURA
      content += `<td>${item.FOLIO_CSSLIC ?? ""}</td>`; // Folio Servicio Social
      content += `<td>${item.LIBRO_CSSLIC ?? ""}</td>`; // Libro Servicio Social
      content += `<td>${item.FOJA_CSSLIC ?? ""}</td>`;  // Foja Servicio Social
      //notas
      content += `<td>${item.ADICIONALES ?? ""}</td>`; // Notas


      // Revisa si las fechas son null o 0, en caso contrario las muestra
      const proyectoObs = (item.PROYECTO_OBS && item.PROYECTO_OBS !== 0) ? item.PROYECTO_OBS : "";
      const obsProyectoLic = (item.OBS_PROYECTO_LIC && item.OBS_PROYECTO_LIC !== 0) ? item.OBS_PROYECTO_LIC : "";

      content += `<td>${proyectoObs}</td>`;
      content += `<td>${obsProyectoLic}</td>`;
      content += "</tr>";
    });

    table.innerHTML = content;
    alumnosLength = alumnos.length;
  } catch (error) {
    console.error("Error al obtener los datos:", error);
    load.style.display = "none";
  }
};

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
