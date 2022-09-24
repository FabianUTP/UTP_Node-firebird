"use strict";

const loader = document.getElementById("preloader");
const container = document.getElementById("container");
const table = document.getElementById("table-container");
const inputSearch = document.getElementById("buscar");
const formInput = document.getElementById("formInput");

let limit = 20;
let skip = 0;
let search = "";

// Hace que no se refresque la pagina en el input de busqueda
formInput.addEventListener("submit", e => e.preventDefault());

// Funcion para la animacion de carga
const changeView = () => {
  loader.style.display = "block";
  container.classList.add("d-none");

  setTimeout(() => {
    loader.style.display = "none";
    container.classList.remove("d-none");
  }, 200);
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

// uncion para buscar por codigo del grupo
const searchAlumno = () => {
  search = inputSearch.value
  skip = 0;
  getAlumnos();
}

// Hace la llamada a la API
const getAlumnos = async () => {
  const res = await fetch(`api/alumnos?limit=${limit}&skip=${skip}&search=${search}`);
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

  changeView();
};

getAlumnos();
