"use strict";

const table = document.getElementById("table-container");
const inputSearch = document.getElementById("buscar");
const formInput = document.getElementById("formInput");

let limit = 20;
let skip = 0;
let search = "";

// Hace que no se recargue la pagina en el input de busqueda
formInput.addEventListener("submit", e => e.preventDefault());

const prev = () => {
  if (skip >= limit) {
    skip -= limit;
    getCarrera();
  }
};

const next = () => {
  skip += limit;
  getCarrera();
};

// uncion para buscar por codigo del grupo
const searchCarrera = () => {
  search = inputSearch.value
  skip = 0;
  getCarrera();
}

// Hace la llamada a la API
const getCarrera = async () => {
  const res = await fetch(`api/carreras?limit=${limit}&skip=${skip}&search=${search}`);
  const { niveles } = await res.json();

  // Vacia la tabla en caso que ya tenga datos
  table.innerHTML = "";

  let content = "";
  niveles.map((item, i) => {
    content += `<tr onclick="window.location.href='/carreras/${item.CODIGO_CORTO}'">`;
    content += `<td>${i + 1}</td>`;
    content += `<td>${item.NIVEL}</td>`;
    content += `<td>${item.ACUERDO}</td>`;
    content += `<td>${item.DESCRIPCION}</td>`;
    content += "</tr>";
  });

  table.innerHTML = content;

  loading();
};

getCarrera();
