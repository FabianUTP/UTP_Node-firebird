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

  if (!idPlan || !eval || !idAsig) {
    return; // Verificar que los campos estén completos
  }

  let url = `/api/calificaciones/asignaturas?idPlan=${idPlan}&idEval=${eval}&idAsig=${idAsig}&idGrupo=${codigo_grupo}`;
  let res = await fetch(url);
  let data = await res.json();

  // Verifica si los datos fueron recibidos correctamente
  if (data && data.length > 0) {
    let content = "";
    data.forEach((item) => {
      content += "<tr>";
      content += `<td>${item.MATRICULA}</td>`; // Matrícula
      content += `<td>${item.PATERNO} ${item.MATERNO} ${item.NOMBRE}</td>`; // Nombre completo
      content += `<td>${item.CALIFICACION || "Sin calificación"}</td>`; // Calificación
      content += "</tr>";
    });

    table.innerHTML = content; // Mostrar los datos en la tabla
  } else {
    table.innerHTML = "<tr><td colspan='3'>No se encontraron datos</td></tr>";
  }
});
