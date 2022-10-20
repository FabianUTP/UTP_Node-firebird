"use strict";

const table = document.getElementById("table-container");
const inputSearch = document.getElementById("buscar");
const formInput = document.getElementById("formInput");

let limit = 20;
let skip = 0;
let search = "";
let orderBy = "codigo_carrera";
let sort = "asc";
let gruposLength = 0;

formInput.addEventListener("submit", (e) => {
  // Hace que no se refresque la pagina en el input de busqueda
  e.preventDefault();
  search = inputSearch.value;
  skip = 0; // Reinicia la paginacion
  getGrupos();
});

// Hace la llamada a la API
const getGrupos = async () => {
  const url = `/api/grupos?limit=${limit}&skip=${skip}&search=${search}&orderBy=${orderBy}&sort=${sort}`;
  const res = await fetch(url);
  const { grupos } = await res.json();

  // Vacia la tabla en caso que ya tenga datos
  table.innerHTML = "";

  let content = "";
  grupos.map((item, i) => {
    content += `<tr onclick="window.location.href=window.location.href+'/${item.CODIGO_GRUPO}'">`;
    content += `<td>${i + 1}</td>`;
    content += `<td>${item.CODIGO_CARRERA}</td>`;
    content += `<td>${item.CODIGO_GRUPO}</td>`;
    content += `<td>${item.GRADO}</td>`;
    content += `<td>${item.GRUPO}</td>`;
    content += `<td>${item.INSCRITOS} de ${item.CUPO_MAXIMO}</td>`;
    content += `<td>${item.CLAVEPROFESOR_TITULAR ?? ''}</td>`;
    content += "</tr>";
  });

  table.innerHTML = content;
  gruposLength = grupos.length;

  loading();
};

const handleOrder = (by) => {
  orderBy = by;
  getGrupos();
};

const handleSort = (by) => {
  sort = by;
  getGrupos();
};

const prev = () => {
  if (skip >= limit) {
    skip -= limit;
    getGrupos();
  }
};

const next = () => {
  if(!(gruposLength < limit)) {
    skip += limit;
    getGrupos();
  }
};

getGrupos();
