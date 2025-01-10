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
  const res = await fetch(url);
  const { alumnos } = await res.json();
  load.style.display = "none";

  let content = "";
  const status = {
    A: "Activo",
    E: "Egresado",
    BA: "Baja",
    S: "Aspirantes"
  }
  alumnos.map((item, i) => {
    content += `<tr onclick="window.location.href='/alumnos/${item.MATRICULA}'">`;
    content += `<td style="text-align: center;">${i + 1}</td>`;
    content += `<td style="text-align: center;">${item.NUMEROALUMNO}</td>`;
    content += `<td style="text-align: center;">${item.PATERNO} ${item.MATERNO}</td>`;
    content += `<td style="text-align: center;">${item.NOMBRE}</td>`;
    content += `<td style="text-align: center;">${item.MATRICULA}</td>`;
    content += `<td style="text-align: center;">${status[item.STATUS] ?? ""}</td>`;
    content += `<td style="text-align: center;">${item.NIVEL}</td>`;
    content += `<td style="text-align: center;">${item.PROYECTO_OBS}</td>`;
    content += `<td style="text-align: center;">${item.OBS_PROYECTO_LIC}</td>`;
    content += "</tr>";
});


  table.innerHTML = content;
  alumnosLength = alumnos.length;
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
  if (!(alumnosLength < limit)) {
    skip += limit;
    getAlumnos();
  }
};

getAlumnos();
