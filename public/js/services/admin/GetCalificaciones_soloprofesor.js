"use strict";

const table = document.getElementById("table-container");
const inputSearch = document.getElementById("buscar");
const load = document.getElementById("load");

let limit = 1000;
let skip = 0;
let search = "";
let orderBy = "inicial";
let sort = "desc";
let gruposLength = 0;

// Obtener IDAuth del objeto window (ajustalo según la forma en que manejas el IDAuth)
const IDAuth = window.IDAuth || ""; // Si el IDAuth no está en el window, asigna un valor por defecto

inputSearch.addEventListener("input", debounce(() => {
  search = inputSearch.value;
  skip = 0; // Reinicia la paginación
  getGrupos(IDAuth);  // Pasar IDAuth a la función
}));

// 📌 Llamada a la API
const getGrupos = async (IDAuth) => {
  table.innerHTML = ""; // Vacía la tabla en caso de que ya tenga datos
  load.style.display = "block";

  // Incluye el IDAuth en la URL
  const url = `/api/gruposCalifi?limit=${limit}&skip=${skip}&orderBy=${orderBy}&sort=${sort}&IDAuth=${IDAuth}`;
  const res = await fetch(url);
  const { grupos } = await res.json();

  load.style.display = "none";

  let content = "";
  grupos
    .filter(item => item.CLAVEPROFESOR_TITULAR) // 📌 Filtra los grupos sin tutor
    .forEach((item, i) => {
      content += `<tr onclick="window.location.href=window.location.href+'/${item.CODIGO_GRUPO}'">`;
      content += `<td>${i + 1}</td>`;
      content += `<td>${item.CODIGO_CARRERA}</td>`;
      content += `<td>${item.INICIAL}</td>`;
      content += `<td>${item.FINAL}</td>`;
      content += `<td>${item.CODIGO_GRUPO}</td>`;
      content += `<td>${item.GRADO}</td>`;
      content += `<td>${item.GRUPO}</td>`;
      content += `<td>${item.INSCRITOS} de ${item.CUPO_MAXIMO}</td>`;
      content += `<td>${item.CLAVEPROFESOR_TITULAR}</td>`;
      content += "</tr>";
    });

  table.innerHTML = content;
  gruposLength = grupos.length;
};

const handleOrder = (by) => {
  orderBy = by;
  getGrupos(IDAuth);  // Pasar IDAuth a la función
};

const handleSort = (by) => {
  sort = by;
  getGrupos(IDAuth);  // Pasar IDAuth a la función
};

const prev = () => {
  if (skip >= limit) {
    skip -= limit;
    getGrupos(IDAuth);  // Pasar IDAuth a la función
  }
};

const next = () => {
  if (!(gruposLength < limit)) {
    skip += limit;
    getGrupos(IDAuth);  // Pasar IDAuth a la función
  }
};

getGrupos(IDAuth);  // Llamada inicial con el IDAuth
