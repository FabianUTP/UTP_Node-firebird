"use strict";

const table = document.getElementById("table-container");
const inputSearch = document.getElementById("buscar");
const load = document.getElementById("load");

let limit = 20;
let skip = 0;
let search = "";
let orderBy = "paterno";
let sort = "asc";
let alumnosLength = 0;

inputSearch.addEventListener("input", debounce(() => {
  search = inputSearch.value;
  skip = 0; // Reinicia la paginacion
  getAlumnos();
}));

// Hace la llamada a la API
const getAlumnos = async () => {
  // Vacia la tabla en caso que ya tenga datos
  table.innerHTML = "";
  load.style.display = "block";

  search = inputSearch.value

  const url = `api/alumnos?limit=${limit}&skip=${skip}&search=${search}&orderBy=${orderBy}&sort=${sort}`;
  const res = await fetch(url);
  const { alumnos } = await res.json();
  load.style.display = "none";

  let content = "";
  const status = {
    A: "Activo",
    E: "Egresado",
    BA: "Baja"
  }

  alumnos.map((item, i) => {
    content += `<tr onclick="window.location.href='/alumnos/${item.MATRICULA}'">`;
    content += `<td>${i + 1}</td>`;
    content += `<td>${item.PATERNO} ${item.MATERNO}</td>`;
    content += `<td>${item.NOMBRE}</td>`;
    content += `<td>${item.MATRICULA}</td>`;
    content += `<td>${status[item.STATUS] ?? ""}</td>`;
    content += `<td>${item.NIVEL}</td>`;
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
