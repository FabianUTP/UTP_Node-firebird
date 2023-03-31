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

  let urlApi = "/api/calificaciones?";

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

// Función que se encarga de rellenar la tabla
function writeTable() {
  let content = "";
  dataTable.forEach((item, index) => {
    content += "<tr>";
    content += `<td>${index + 1}</td>`;
    content += `<td>${item.PATERNO} ${item.MATERNO} ${item.NOMBRE}</td>`;
    content += `<td>${item.MATRICULA}</td>`;
    content += `<td><input 
                      name="${item.NUMEROALUMNO}" 
                      value="${item.CALIFICACION}"
                      size="3"
                      autocomplete="off"
                    >
                    </input>
                </td>`;
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

  // Función para prevenir guardar sin preguntar
  const accept = confirm("Desea guardar los siguientes cambios?");
  if(!accept) return;

  const background = document.getElementById("setCalifi");

  background.classList.remove("d-none");

  const formData = new FormData(event.target);

  // Obtiene los datos de la tabla en forma de un Objeto
  const data = Object.fromEntries(formData);

  // Variable final que se mandara en el fetch
  let finalData = {};

  // Filtra solo los datos modificados
  Object.keys(data).filter((key) => {
    let info = initialDataTable.find((item) => item.NUMEROALUMNO == key);
    if (info.CALIFICACION !== data[key]) {
      finalData = {
        ...finalData,
        [key]: data[key],
      };
    }
  });

  // Ruta de la api
  let url = "/api/calificaciones?";

  // Manda las query necesarias
  Object.keys(params).forEach((item) => {
    url += `${item}=${params[item]}&`;
  });

  // Proceso para subir las calificaciones
  await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(finalData),
  });

  background.classList.add("d-none");
  main();
});

// Función que lee el excel y manda en la tabla
fileExcel.addEventListener("change", () => {
  readXlsxFile(fileExcel.files[0]).then((data = []) => {
    let excelFiltrado = [];
    let calif_changed = 0;

    // Utiliza el excel a partir de la octava columna
    data.forEach((item, index) => {
      if (index > 7) {
        excelFiltrado.push(item);
      }
    });

    // Filtra los datos del excel y lo formatea
    let formatJson = excelFiltrado.map((value) => ({
      nombre: value[1],
      matricula: value[2],
      calificacion: value[3],
    }));

    // Sobrescribe los datos correspondientes en la tabla
    dataTable = dataTable.map((item) => {
      let data = formatJson.find(
        (itemJson) => itemJson.matricula == item.MATRICULA
      );

      if (data) {
        calif_changed++;
        return {
          ...item,
          CALIFICACION: data.calificacion,
        };
      } else {
        return item;
      }
    });

    // Muestra en pantalla el numero de registros modificados
    let span = document.getElementById("info_excel");
    span.innerText = `Se han modificado ${calif_changed}/${dataTable.length} registros`;

    writeTable();
  });
});

main();
