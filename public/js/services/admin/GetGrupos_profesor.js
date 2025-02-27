"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const table = document.getElementById("table-container");
  const inputSearch = document.getElementById("buscar");
  const inputProfesor = document.getElementById("buscar-profesor");
  const load = document.getElementById("load");

  let limit = 20;
  let skip = 0;
  let search = "";
  let searchProfesor = "";
  let orderBy = "codigo_carrera";
  let sort = "asc";
  let gruposLength = 0;

  if (inputSearch) {
    inputSearch.addEventListener("input", debounce(() => {
      search = inputSearch.value;
      skip = 0;
      getGrupos();
    }));
  }

  if (inputProfesor) {
    inputProfesor.addEventListener("input", debounce(() => {
      searchProfesor = inputProfesor.value;
      skip = 0;
      getGrupos();
    }));
  }

  const getGrupos = async () => {
    table.innerHTML = "";
    load.style.display = "block";

    const url = `/api/gruposCalifi?limit=${limit}&skip=${skip}&search=${search}&searchProfesor=${searchProfesor}&orderBy=${orderBy}&sort=${sort}`;
    const res = await fetch(url);
    const { grupos } = await res.json();

    load.style.display = "none";

    let content = "";
    const filteredGrupos = grupos.filter(item => 
      searchProfesor ? item.CLAVEPROFESOR_TITULAR?.toLowerCase().includes(searchProfesor.toLowerCase()) : true
    );
    
    filteredGrupos.map((item, i) => {
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
    gruposLength = filteredGrupos.length;
  };

  getGrupos();
});
