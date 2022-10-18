"use strict";

const table = document.getElementById("table-container");
const inputSearch = document.getElementById("buscar");
const formInput = document.getElementById("formInput");

let limit = 20;
let skip = 0;
let search = "";
let orderBy = "paterno";
let sort = "asc";

formInput.addEventListener("submit", (e) => {
  // Hace que no se refresque la pagina en el input de busqueda
  e.preventDefault();

  search = inputSearch.value;
  skip = 0; // Reinicia la paginacion
  getAlumnos();
});

// Hace la llamada a la API
const getAlumnos = async () => {
  const url = `api/alumnos?limit=${limit}&skip=${skip}&search=${search}&orderBy=${orderBy}&sort=${sort}`;

  const res = await fetch(url);
  const { alumnos } = await res.json();

  // Vacia la tabla en caso que ya tenga datos
  table.innerHTML = "";

  let content = "";
  alumnos.map((item, i) => {
    content += `<tr onclick="window.location.href='/alumnos/${item.MATRICULA}'">`;
    content += `<td>${i + 1}</td>`;
    content += `<td>Foto :3</td>`;
    content += `<td>${item.PATERNO} ${item.MATERNO}</td>`;
    content += `<td>${item.NOMBRE}</td>`;
    content += `<td>${item.MATRICULA}</td>`;
    content += "</tr>";
  });

  table.innerHTML = content;

  loading();
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
  skip += limit;
  getAlumnos();
};

getAlumnos();
