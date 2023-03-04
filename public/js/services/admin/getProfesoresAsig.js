const table = document.getElementById("table-content");
const boton = document.getElementById("buscar");
const idplan = document.getElementById("idPlan")


let page = 1;

boton.addEventListener(
    "input",
    debounce((event) => {
      search = event.target.value;
      page = 1;
      getProfesoresAsig();
    })
  );


async function getProfesoresAsig(){
    let url = `/api/profesores/${idprofesor.value}/grupos`;
    const response = await fetch(url);
    const api = await response.json();
  
    let content = "";
    api.data.forEach((item) => {
      content += `<tr >`;
      content += `<td>${item.CLAVEASIGNATURA}</td>`;
      content += `<td>${item.CODIGO_GRUPO}</td>`;
      content += `<td><div class="dropdown">
      <a class="btn btn-secondary dropdown-toggle" href="#" role="button" id="dropdownMenuLink" data-bs-toggle="dropdown" aria-expanded="false">
      Ver más
    </a>
  
    <ul class="dropdown-menu" aria-labelledby="dropdownMenuLink">
      <li><a class="dropdown-item" href="/profesores/${item.CLAVEPROFESOR}/ver_calif/${item.CLAVEASIGNATURA}/${item.ID_PLAN}">Ver calificaciones</a></li>
      <li><a class="dropdown-item" href="/profesores/${item.CLAVEPROFESOR}/subir_calif/${item.CLAVEASIGNATURA}">Subir Calificaciones</a></li>
     
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

getProfesoresAsig()

