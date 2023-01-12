const table = document.getElementById("table-content");

let page = 1;

async function getPlanes() {
  const response = await fetch(`/api/planes?page=${page}`);
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
      <li><a class="dropdown-item" href="#">Ver asignatura</a></li>
      <li><a class="dropdown-item" href="#">Método de evaluación</a></li>
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

getPlanes();
