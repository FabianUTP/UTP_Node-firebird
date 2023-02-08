const table = document.getElementById("table-content");
const boton = document.getElementById("buscar");

let page = 1;
let search = "";

//boton de buscar
boton.addEventListener(
    "input",
    debounce((event) => {
      search = event.target.value;
      page = 1;
      getProfesores();
    })
  );

async function getProfesores(){
    let url = `/api/profesores?page=${page}&search=${search}`;
    const response = await fetch(url);
    const api = await response.json();
  
    let content = "";
    api.data.forEach((item, index) => {
      content += `<tr>`;
      content += `<td>${index + 1} </td>`;
      content += `<td>${item.ID_ESCUELA}</td>`;
      content += `<td>${item.CLAVEPROFESOR}</td>`;
      content += `<td>${item.NOMBREPROFESOR}</td>`;
      content += `<td><div class="dropdown">
      </div></td>`;

    content += "</tr>";
  });

  table.innerHTML = content;
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
