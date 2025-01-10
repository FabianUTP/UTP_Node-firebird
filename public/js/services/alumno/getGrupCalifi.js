const selectContainer = document.getElementById('select-container');
const inputSearch = document.getElementById("buscar");
const inputGrado = document.getElementById("inputcuatri");
const inputGrupo = document.getElementById("inputcarrera");
const load = document.getElementById("load");



//

  let dato = ''; 

//

let limit = 20;
let skip = 0;
let search = "";
let orderBy = "codigo_carrera";
let sort = "asc";
let grado = inputGrado.value;
let grupo = inputGrupo.value;
let gruposLength = 0;

inputSearch.addEventListener("input", debounce(() => {
  search = inputSearch.value;
  grado = inputGrado.value;
  grupo = inpuntGrupo.value;
  skip = 0; // Reinicia la paginacion
  getGrupos();
}));

// Hace la llamada a la API
const getGrupos = async () => {

  selectContainer.innerHTML = ""; // Limpiar opciones existentes
  load.style.display = "block";

  const url = `/api/gruposCalifi?limit=${limit}&skip=${skip}&search=${search}&orderBy=${orderBy}&sort=${sort}&grupo=${grupo}&grado=${grado}`;
  const res = await fetch(url);
  const { grupos } = await res.json();

  load.style.display = "none";

  grupos.forEach((item, i) => {
    const option = document.createElement('option');
    option.textContent = `${item.CODIGO_CARRERA} - ${item.CODIGO_GRUPO}`;
    option.value = JSON.stringify(item); // Puedes asignar algún valor único aquí si lo deseas
    selectContainer.appendChild(option);
  });

  gruposLength = grupos.length;
};

const handleOrder = (by) => {
  orderBy = by;
  getGrupos();
};

const handleSort = (by) => {
  sort = by;
  getGrupos();
};



getGrupos();
