const table = document.getElementById("table-content");
const boton = document.getElementById("buscar");

let page = 1;
let search = "";

// Botón de buscar
boton.addEventListener(
  "input",
  debounce((event) => {
    search = event.target.value;
    page = 1;
    getProfesores();
  })
);

async function getProfesores() {
  let url = `/api/profesores?page=${page}&search=${search}`;
  const response = await fetch(url);
  const api = await response.json();

  let content = "";
  let allGrupos = [];  // Arreglo para almacenar todos los grupos

  for (let index = 0; index < api.data.length; index++) {
    const item = api.data[index];

    // Obtener los grupos asignados al profesor
    let grupos = await getGruposByProfesor(item.CLAVEPROFESOR);

    // Agregar los grupos a la lista global
    allGrupos = [...allGrupos, ...grupos];

    content += `<tr>`;
    content += `<td>${index + 1}</td>`; // Número de fila
    content += `<td>${item.CLAVEPROFESOR}</td>`; // Clave del profesor
    content += `<td>${item.NOMBREPROFESOR}</td>`; // Nombre del profesor

    // Mostrar los grupos asignados
    content += `<td>${grupos.join(", ")}</td>`; // Lista de grupos asignados

    content += `<td>
                  <div class="dropdown">
                    <a class="btn btn-secondary dropdown-toggle" href="#" role="button" id="dropdownMenuLink" data-bs-toggle="dropdown" aria-expanded="false">
                      Ver Más
                    </a>
                    <ul class="dropdown-menu" aria-labelledby="dropdownMenuLink">
                      <li><a class="dropdown-item" href="/profesores/${item.CLAVEPROFESOR}">Ver Ficha</a></li>
                      <li><a class="dropdown-item" href="/profesores/${item.CLAVEPROFESOR}/asignacion">Asignación de Grupo</a></li>
                      <li><a class="dropdown-item" href="/profesores/${item.CLAVEPROFESOR}/Perfil">Perfil Académico</a></li>
                      <li><a class="dropdown-item" href="/profesores/${item.CLAVEPROFESOR}/profesores-list">Horario Contratado</a></li>
                    </ul>
                  </div>
                </td>`;

    content += `</tr>`;
  }

  // Eliminar duplicados de la lista de grupos
  const uniqueGrupos = [...new Set(allGrupos)];

  // Ordenar los grupos de mayor a menor (alfabéticamente)
  uniqueGrupos.sort((a, b) => b.localeCompare(a));

  // Mostrar todos los grupos únicos en la tabla
  let gruposContent = `<tr><td colspan="5">Grupos Asignados: ${uniqueGrupos.join(", ")}</td></tr>`;

  // Añadir la fila con los grupos únicos ordenados al contenido de la tabla
  table.innerHTML = gruposContent + content;
}

// Función para obtener los grupos a los que está asignado un profesor
async function getGruposByProfesor(claveProfesor) {
  let grupos = [];

  // Realizar la consulta para obtener los grupos asignados al profesor
  const res = await fetch(`/api/profesores/${claveProfesor}/grupos`);
  const data = await res.json();

  if (data && data.length > 0) {
    grupos = data.map(grupo => grupo.CODIGO_GRUPO);
  }

  return grupos;
}

function onPrev() {
  if (page > 1) {
    page--;
    getProfesores();
  }
}

function onNext() {
  page++;
  getProfesores();
}

getProfesores();
