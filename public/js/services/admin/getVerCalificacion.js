const selectEval = document.getElementById("idPlan");
const statusLoading = document.getElementById("loading");
const table = document.getElementById("table-content");

const asigName = document.getElementById("asig");
const grupoName = document.getElementById("grupo");

const url = new URL(location.href);
const searchQuery = url.searchParams;

let params = {
  idPlan: searchQuery.get("idPlan"),
  claveAsig: searchQuery.get("claveAsig"),
  nombreAsig: searchQuery.get("nombreAsig"),
  grupo: searchQuery.get("grupo"),
  idEtapa: searchQuery.get("idEtapa"),
  idEval: "A",
  inicial: searchQuery.get("inicial"),
  final: searchQuery.get("final"),
  periodo: searchQuery.get("periodo"),
};

grupoName.innerHTML = `Grupo: ${params.grupo}`;
asigName.innerHTML = `Asignatura: ${params.nombreAsig}`;

async function main() {
  table.innerHTML = ""
  statusLoading.classList.remove("d-none");

  let urlApi = "/api/calificaciones?";

  Object.keys(params).forEach((item) => {
    urlApi += `${item}=${params[item]}&`;
  });

  const res = await fetch(urlApi);
  const { data } = await res.json();

  let content = "";
  data.forEach((item, index) => {
    content += "<tr>";
    content += `<td>${index + 1}</td>`;
    content += `<td>${item.PATERNO} ${item.MATERNO} ${item.NOMBRE}</td>`;
    content += `<td>${item.MATRICULA}</td>`;
    content += `<td>${item.CALIFICACION}</td>`;
    content += `<td>${item.FECHA}</td>`;
    content += "</tr>";
  });

  statusLoading.classList.add("d-none");
  table.innerHTML = content;
}

selectEval.addEventListener("change", ({ target }) => {
  params["idEval"] = target.value;

  main();
});

main();
