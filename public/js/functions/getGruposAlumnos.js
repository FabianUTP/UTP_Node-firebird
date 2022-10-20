"use strict";

const table = document.getElementById("table-container");
const idGrupo = document.getElementById("idGrupo");

let limit = 20;
let skip = 0;
let alumnosLength = 0;

// Hace la llamada a la API
const getAlumnos = async () => {
  const url = `/api/grupos_alumnos/${idGrupo.value}?limit=${limit}&skip=${skip}`;

  const res = await fetch(url);
  const { alumnos } = await res.json();

  // Vacia la tabla en caso que ya tenga datos
  table.innerHTML = "";

  let content = "";
  alumnos.map((item, i) => {
    content += `<tr onclick="window.location.href='/alumnos/${item.MATRICULA}'">`;
    content += `<td>${i + 1}</td>`;
    content += `<td>${item.PATERNO} ${item.MATERNO}</td>`;
    content += `<td>${item.NOMBRE}</td>`;
    content += `<td>${item.MATRICULA}</td>`;
    content += "</tr>";
  });

  table.innerHTML = content;
  alumnosLength = alumnos.length;

  loading();
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
