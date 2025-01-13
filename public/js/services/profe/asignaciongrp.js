const table = document.getElementById("table-content");
const boton = document.getElementById("buscar");
const idplan = document.getElementById("idPlan");

let page = 1;

boton.addEventListener(
  "input",
  debounce((event) => {
    search = event.target.value;
    page = 1;
    getProfesoresAsig();
  })
);

async function getProfesoresAsig() {
  let url = `/api/profesores/${idprofesor.value}/grupos?page=${page}`;
  const response = await fetch(url);
  const api = await response.json();

  let content = "";
  api.data.forEach((item, index) => {
    // Si el periodo es 2, no mostrar los datos
    if (item.PERIODO === 2) {
      return; // Salir de la iteración sin mostrar nada
    }

    // Querys que servirán para la consulta de los alumnos en el grupo
    let query = `idPlan=${item.ID_PLAN}`;
    query += `&claveAsig=${item.CLAVEASIGNATURA}`;
    query += `&nombreAsig=${item.NOMBREASIGNATURA}`;
    query += `&grupo=${item.CODIGO_GRUPO}`;
    query += `&idEtapa=${item.ID_ETAPA}`;
    query += `&inicial=${item.INICIAL}`;
    query += `&final=${item.FINAL}`;
    query += `&periodo=${item.PERIODO}`;

    content += `<tr>`;
    content += `<td>${index + 1}</td>`;
    content += `<td>${item.CLAVEASIGNATURA}</td>`;
    content += `<td>${item.NOMBREASIGNATURA}</td>`;
    content += `<td>${item.CODIGO_GRUPO}</td>`;
    content += `<td><div class="dropdown">
      <a class="btn btn-secondary dropdown-toggle" href="#" role="button" id="dropdownMenuLink" data-bs-toggle="dropdown" aria-expanded="false">
      Ver más
    </a>

    <ul class="dropdown-menu" aria-labelledby="dropdownMenuLink">
    
      <li>
        <a 
          class="dropdown-item" 
          href="/grupoprofe/${item.CLAVEPROFESOR}/ver_calif?${query}"
        >
          Ver calificaciones
        </a>
      </li>

      <li>
        <a 
          class="dropdown-item" 
          href="/grupoprofe/${item.CLAVEPROFESOR}/subir_calif?${query}"
        >
          Subir Calificaciones
        </a>
      </li>
     
    </ul>
      </div></td>`;

    content += "</tr>";
  });

  table.innerHTML = content;
}

function onPrev() {
  if (page > 1) {
    page--;
    getProfesoresAsig();
  }
}

function onNext() {
  page++;
  getProfesoresAsig();
}

getProfesoresAsig();
