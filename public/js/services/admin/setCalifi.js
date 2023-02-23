const selectPlan = document.getElementById("plan");
const selectEval = document.getElementById("evaluacion");
const selectAsig = document.getElementById("asignatura");

const table = document.getElementById("table-body");
const codigo_grupo = document.getElementById("codigo_grupo").value;

let idPlan = "";
let eval = "";

selectPlan.addEventListener("change", async (event) => {
  idPlan = event.target.value;
  let url = `/api/planes/${idPlan}/eval`;
  const res = await fetch(url);
  const { data } = await res.json();

  let content = "";
  data.forEach((element) => {
    content += `<option value="${element?.ID_EVAL}">${element?.NOMBRECORTO}</option>`;
  });

  selectEval.innerHTML = content;

  getAsignaturas();
});

selectEval.addEventListener("change", (event) => {
  eval = event.target.value;
});

const getAsignaturas = async () => {
  let url = `/api/planes/${idPlan}/asig`;
  const res = await fetch(url);
  const { data } = await res.json();

  let content = "<option disabled selected>Seleccione la asignatura</option>";
  data.forEach((item) => {
    content += `<option value="${item.CLAVEASIGNATURA}">${item.NOMBREASIGNATURA}</option>`;
  });

  selectAsig.innerHTML = content;
};

selectAsig.addEventListener("change", async (event) => {
  let idAsig = event.target.value;

  let url = `/api/calificaciones/asignaturas?idPlan=${idPlan}&idEval=${eval}&idAsig=${idAsig}&idGrupo=${codigo_grupo}`;
  let res = await fetch(url);
  let data = await res.json();

  console.log(data)
});
