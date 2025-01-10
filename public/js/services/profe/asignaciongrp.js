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

// Cambios en la función de maestro ---> para ver las calificaciones
async function getProfesoresAsig() {
  let url = `/api/profesores/${idprofesor.value}/grupos?page=${page}`;
  const response = await fetch(url);
  const api = await response.json();

  let content = "";
  api.data.forEach((item, index) => {
    // Función para reemplazar null o 0 con un valor vacío
    const safeValue = (value) => {
      return value === null || value === 0 ? "" : value;
    };

    // Querys que servirán para la consulta de los alumnos en el grupo
    let query = `idPlan=${safeValue(item.ID_PLAN)}`;
    query += `&claveAsig=${safeValue(item.CLAVEASIGNATURA)}`;
    query += `&nombreAsig=${safeValue(item.NOMBREASIGNATURA)}`;
    query += `&grupo=${safeValue(item.CODIGO_GRUPO)}`;
    query += `&idEtapa=${safeValue(item.ID_ETAPA)}`;
    query += `&inicial=${safeValue(item.INICIAL)}`;
    query += `&final=${safeValue(item.FINAL)}`;
    query += `&periodo=${safeValue(item.PERIODO)}`;

    // Para ver asignaturas
    content += `<tr>`;
    content += `<td>${index + 1}</td>`; // Índice de fila
    content += `<td>${safeValue(item.CLAVEASIGNATURA)}</td>`;
    content += `<td>${safeValue(item.NOMBREASIGNATURA)}</td>`;
    content += `<td>${safeValue(item.CODIGO_GRUPO)}</td>`;
    content += `<td><div class="dropdown">
      <a class="btn btn-secondary dropdown-toggle" href="#" role="button" id="dropdownMenuLink" data-bs-toggle="dropdown" aria-expanded="false">
        Ver más
      </a>
      <ul class="dropdown-menu" aria-labelledby="dropdownMenuLink">
        <li>
          <a class="dropdown-item" href="/grupoprofe/${safeValue(item.CLAVEPROFESOR)}/ver_calif?${query}">
            Ver calificaciones
          </a>
        </li>
        <li>
          <a class="dropdown-item" href="/grupoprofe/${safeValue(item.CLAVEPROFESOR)}/subir_calif?${query}">
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
