const table = document.getElementById("table-content");
const inputSearch = document.getElementById("buscar");
const carrerasSelect = document.getElementById("inputcarrera");

let page = 1;
let search = "";
let id_nivel = "";

//realizacion del boton buscar
inputSearch.addEventListener(
  "input",
  debounce((event) => {
    search = event.target.value;
    page = 1;
    getPlanes();
  })
);

async function getPlanes() {
  let url = `/api/planes?page=${page}&search=${search}&nivel=${id_nivel}`;
  const response = await fetch(url);
  const api = await response.json();

  let content = "";
  api.data.forEach((item, index) => {
    content += `<tr>`;
    content += `<td>${index + 1} </td>`;
    content += `<td>${item.NIVEL}</td>`;
    content += `<td>${item.ID_PLAN}</td>`;
    content += `<td>${item.NOMBRE_PLAN}</td>`;
    content += `<td><div class="dropdown">
    <a class="btn btn-secondary dropdown-toggle" href="#" role="button" id="dropdownMenuLink" data-bs-toggle="dropdown" aria-expanded="false">
      Ver Más
    </a>
  
    <ul class="dropdown-menu" aria-labelledby="dropdownMenuLink">
      <li><a class="dropdown-item" href="/academico/planes/${item.ID_PLAN}/asignaturas">Ver asignatura</a></li>
      <li><a class="dropdown-item" href="/academico/planes/${item.ID_PLAN}/evaluacion">Método de evaluación</a></li>
      <li><a class="dropdown-item" href="/academico/planes/${item.ID_PLAN}">Editar</a></li>
      <li><a class="dropdown-item" href="#">Eliminar</a></li>
    </ul>
  </div></td>`;
    content += "</tr>";
  });

  table.innerHTML = content;
}
function onPrev() {
  if (page > 1) {
    page--;
    getPlanes();
  }
}

function onNext() {
  page++;
  getPlanes();
}

async function getCarreas() {
  const res = await fetch("/api/carreras");
  const { niveles } = await res.json();

  let content = "<option value=''>Todos</option>";
  niveles.forEach((item) => {
    content += `<option value="${item.NIVEL}">${item.DESCRIPCION}</option>`;
  });

  carrerasSelect.innerHTML = content;
}

function changeCarreas() {
  id_nivel = carrerasSelect.value;
  getPlanes();
}

getPlanes();
getCarreas();
