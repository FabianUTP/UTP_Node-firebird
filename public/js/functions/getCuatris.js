"use strict";

const table = document.getElementById("table-container");
const inputSearch = document.getElementById("buscar");

let limit = 20;
let skip = 0;
let search = "";

// Funcion para buscar por codigo del cuatrimestre
inputSearch.addEventListener("input", debounce(() => {
  search = inputSearch.value
  skip = 0;
  getCuatris();
}));

const prev = () => {
  if (skip >= limit) {
    skip -= limit;
    getCuatris();
  }
};

const next = () => {
  skip += limit;
  getCuatris();
};

// Hace la llamada a la API
const getCuatris = async () => {
  const res = await fetch(`/api/cuatrimestres?limit=${limit}&skip=${skip}&search=${search}`);
  const { ciclos } = await res.json();

  // Vacia la tabla en caso que ya tenga datos
  table.innerHTML = "";

  let content = "";
  ciclos.map((item, i) => {
    content += `<tr onclick="window.location.href='/cuatrimestres/${item.CODIGO_CORTO}'">`;
    content += `<td>${i + 1}</td>`;
    content += `<td>${item.INICIAL}</td>`;
    content += `<td>${item.FINAL}</td>`;
    content += `<td>${item.PERIODO}</td>`;
    content += `<td>${item.DESCRIPCION}</td>`;
    content += `<td>${item.CODIGO_CORTO}</td>`;
    content += "</tr>";
  });

  table.innerHTML = content;
};

getCuatris();
