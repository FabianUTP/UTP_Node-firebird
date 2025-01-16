"use strict";

const selectCuatri = document.getElementById("selectciclo");

selectCuatri.addEventListener("change", (e) => {

  let configFetch = {
    method: "PUT",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      periodo: e.target.value
    })
  }

  fetch("/api/update/CuatriXGrupos", configFetch)
  .then(res => res.json())
  .then(res => console.log(res))
  .catch(err => console.warn(err))

  location.reload()
})


const getCuatrisNavbar = async () => {
  const res = await fetch("/api/cuatris-navbar");
  const { ciclos, periodoSelected } = await res.json();

  //Vacia el contenido del select
  selectCuatri.innerHTML = "";

  // Variable para crear las opciones y mandar al Select
  let content = "";

  // Muestra el que ya esta seleccionado
  if(periodoSelected) {
    content += `<option disabled selected>${periodoSelected}</option>`;
  }
  content += "<option value='none'>Seleccionar Ciclo</option>";

  ciclos.reverse().map(item => {
    content += `<option value="${item.CODIGO_CORTO}">`;
    content += `${item.DESCRIPCION}`;
    content += "</option>";
  });

  selectCuatri.innerHTML = content;

};

getCuatrisNavbar();
