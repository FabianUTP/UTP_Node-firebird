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

const statusMap = {
  A: "Activo",
  E: "Egresado",
  BA: "Baja"
};

// Debounce para evitar múltiples llamadas a la API mientras el usuario escribe
const debounce = (func, delay = 300) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
};

inputSearch.addEventListener("input", debounce(() => {
  search = inputSearch.value.trim();
  skip = 0; // Reinicia la paginación
  getAlumnos();
}));

// Obtiene los alumnos desde la API
const getAlumnos = async () => {
  try {
    table.innerHTML = ""; // Limpia la tabla antes de cargar nuevos datos
    load.style.display = "block";

    const url = `/api/alumnos?limit=${limit}&skip=${skip}&search=${encodeURIComponent(search)}&orderBy=${orderBy}&sort=${sort}`;
    const res = await fetch(url);
    const { alumnos } = await res.json();

    load.style.display = "none";
    alumnosLength = alumnos.length;

    if (!alumnos.length) {
      table.innerHTML = "<tr><td colspan='6' class='text-center'>No se encontraron alumnos</td></tr>";
      return;
    }

    const fragment = document.createDocumentFragment();

    alumnos.forEach((item, i) => {
      const row = document.createElement("tr");
      row.onclick = () => window.location.href = `/alumnos/${item.MATRICULA}`;

      row.innerHTML = `
        <td>${i + 1}</td>
        <td>${item.PATERNO} ${item.MATERNO || ""}</td>
        <td>${item.NOMBRE}</td>
        <td>${item.MATRICULA}</td>
        <td>${statusMap[item.STATUS] || ""}</td>
        <td>${item.NIVEL}</td>
      `;

      fragment.appendChild(row);
    });

    table.appendChild(fragment);

  } catch (error) {
    console.error("Error al obtener alumnos:", error);
    load.style.display = "none";
    table.innerHTML = "<tr><td colspan='6' class='text-center text-danger'>Error al cargar datos</td></tr>";
  }
};

// Funciones para ordenar y cambiar la dirección del orden
const handleOrder = (by) => {
  if (orderBy === by) return; // Evita llamadas innecesarias
  orderBy = by;
  getAlumnos();
};

const handleSort = (by) => {
  if (sort === by) return;
  sort = by;
  getAlumnos();
};

// Paginación
const prev = () => {
  if (skip >= limit) {
    skip -= limit;
    getAlumnos();
  }
};

const next = () => {
  if (alumnosLength === limit) { // Si hay exactamente `limit` registros, hay más páginas
    skip += limit;
    getAlumnos();
  }
};

getAlumnos();
