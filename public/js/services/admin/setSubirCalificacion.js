const table = document.getElementById("table-content");
const selectEval = document.getElementById("idPlan");
const asigName = document.getElementById("asig");
const grupoName = document.getElementById("grupo");
const statusLoading = document.getElementById("loading");

const formCalif = document.getElementById("formCalif");
const fileExcel = document.getElementById("input");

const url = new URL(location.href);
const searchQuery = url.searchParams;

let params = {
  idEval: "A",
  inicial: searchQuery.get("inicial"),
  final: searchQuery.get("final"),
  idPlan: searchQuery.get("idPlan"),
  claveAsig: searchQuery.get("claveAsig"),
  nombreAsig: searchQuery.get("nombreAsig"),
  grupo: searchQuery.get("grupo"),
  idEtapa: searchQuery.get("idEtapa"),
  periodo: searchQuery.get("periodo"),
};

asigName.innerHTML = `Asignatura: ${params.nombreAsig}`;
grupoName.innerHTML = `Grupo: ${params.grupo}`;


// Almacena la información de la tabla
let dataTable = [];
let initialDataTable = [];

// Función principal
async function main() {
  table.innerHTML = "";
  statusLoading.classList.remove("d-none");

  let urlApi = "/api/calificaciones/asignaturas/alumnos?";

  Object.keys(params).forEach((item) => {
    urlApi += `${item}=${params[item]}&`;
  });

  const res = await fetch(urlApi);
  const { data } = await res.json();
  dataTable = data;
  initialDataTable = data;

  writeTable();
  statusLoading.classList.add("d-none");
}

// Función que se encarga de rellena la tabla
function writeTable () {
  let content = "";
  dataTable.forEach((item, index) => {
    content += "<tr>";
    content += `<td>${index + 1}</td>`;
    content += `<td>${item.PATERNO} ${item.MATERNO} ${item.NOMBRE}</td>`;
    content += `<td>${item.MATRICULA}</td>`;
    content += `<td><input size="3" name="${item.NUMEROALUMNO}" value="${item.CALIFICACION}"></input></td>`;
    content += "</tr>";
  });

  table.innerHTML = content;
}

// Cambia la evaluación de las calificaciones y reinicia la tabla
selectEval.addEventListener("change", ({ target }) => {
  params["idEval"] = target.value;

  main();
});

// Función para actualizar calificaciones
formCalif.addEventListener("submit", async (event) => {
  event.preventDefault();
  const background = document.getElementById("setCalifi");

  background.classList.remove("d-none");

  const formData = new FormData(event.target);
  
  // Obtiene los datos en forma de un Objeto
  const data = Object.fromEntries(formData);

  // Variable que se manda en la DB
  let finalData = {}

  // Filtra solo los datos modificados
  Object.keys(data).filter(key => {
    let info = initialDataTable.find(item => item.NUMEROALUMNO == key);
    if (info.CALIFICACION !== data[key]) {
      finalData = {
        ...finalData,
        [key]: data[key]
      }
    }
  });

  // Ruta de la api
  let url = "/api/calificaciones?";
  
  // Manda las query necesarias
  Object.keys(params).forEach(item => {
    url += `${item}=${params[item]}&`;
  })
  
  // Proceso para subir las calificaciones
  await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  background.classList.add("d-none");
  main();
  
});

// Función que lee el excel y manda en la tabla
fileExcel.addEventListener("change", () => {
  readXlsxFile(fileExcel.files[0]).then((data = []) => {
    let excelFiltrado = [];

    data.forEach((item, index) => {
      if (index > 7) {
        excelFiltrado.push(item);
      }
    });

    let formatJson = excelFiltrado.map((value) => {
      return {
        nombre: value[1],
        matricula: value[2],
        calificacion: value[3],
      };
    });

    dataTable = dataTable.map(item => {      
      let data = formatJson.find(itemJson => itemJson.matricula == item.MATRICULA);

      if (data) {
        return {
          ...item,
          CALIFICACION: data.calificacion
        }
      } else {
        return item;
      }
    });

    writeTable()

  });
});

main();
