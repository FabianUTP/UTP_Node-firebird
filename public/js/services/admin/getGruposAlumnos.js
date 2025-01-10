"use strict";

const loader_table = document.getElementById("loader");

const table = document.getElementById("table-container");
const idGrupo = document.getElementById("idGrupo");
const num_muj = document.getElementById("num_muj");
const num_hom = document.getElementById("num_hom");

let limit = 20;
let skip = 0;
let alumnosLength = 0;

// Hace la llamada a la API
const getAlumnos = async () => {
  // Vacía la tabla en caso de que ya tenga datos
  table.innerHTML = "";
  loader_table.style.display = "block";

  const url = `/api/grupos_alumnos/${idGrupo.value}?limit=${limit}&skip=${skip}`;
  const res = await fetch(url);
  const { alumnos } = await res.json();

  // Oculta el spinner "Loading"
  loader_table.style.display = "none";

  let content = "";

  // Conteo de mujeres y hombres
  let countHom = 0;
  let countMuj = 0;

  const status = {
    A: "Activo",
    E: "Egresado",
    BA: "Baja",
  };

  alumnos.forEach((item, i) => {
    if (item.GENERO === "M") {
      countHom++;
    } else {
      countMuj++;
    }

    content += `<tr onclick="window.location.href='/alumnos/${item.MATRICULA}'">`;
    content += `<td>${skip + i + 1}</td>`;  // Ajuste de la numeración aquí
    content += `<td>${item.PATERNO} ${item.MATERNO} ${item.NOMBRE}</td>`;
    content += `<td>${item.MATRICULA}</td>`;
    content += `<td>${status[item.STATUS] ?? ""}</td>`;
    content += `<td>${item.NIVEL}</td>`;

    content += "</tr>";
  });

  table.innerHTML = content;
  num_hom.innerHTML = `${countHom}`;
  num_muj.innerHTML = `${countMuj}`;
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
