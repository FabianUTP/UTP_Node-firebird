'use strict';

const loader = document.getElementById("preloader");
const container = document.getElementById("container");
const table = document.getElementById('table-container');


let limit = 25;
let skip = 0;

const changeView = () => {
  setTimeout(() => {
    loader.style.display = "none";
    container.classList.remove("d-none");
  }, 700);
};

const prev = () => {
  console.log("prev", limit)
  if(skip >= limit) {
    // limit -= 10;
    skip -= limit;
  }
  getGrupos();
}

const next = () => {
  console.log("next", limit)
  skip += limit;
  getGrupos()
}

const getGrupos = async () => {
  const res = await fetch(`api/grupos?limit=${limit}&skip=${skip}`);
  const data = await res.json();
  console.log(data)

  table.innerHTML = "";

  let content = "";
  data.grupos.map((item, i) => {
    content += `<tr>`;
    content += `<td>${i + 1}</td>`;
    content += `<td>${item.NIVEL}</td>`;
    content += `<td>${item.CODIGO_GRUPO}</td>`;
    content += `<td>${item.GRADO}</td>`;
    content += `<td>${item.GRUPO}</td>`;
    content += `<td>${item.INSCRITOS} de ${item.CUPO_MAXIMO}</td>`;
    content += `<td>${item.CLAVEPROFESOR_TITULAR}</td>`;
    content += "</tr>";
  })

  table.innerHTML = content;
  
  changeView();

};

getGrupos();
