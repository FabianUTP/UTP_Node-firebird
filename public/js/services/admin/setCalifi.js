const idGrupo = document.getElementById("codigo_grupo");
const formPlan = document.getElementById("formPlan");
const planEst = document.getElementById("planEst");
const asignatura = document.getElementById("asignatura");
const table = document.getElementById("table-body");

const pathApi = "/api/calificaciones";

formPlan.addEventListener("submit", (e) => {
  e.preventDefault();
  getAsignaturas();
});

const getAsignaturas = async () => {
  let url = `/api/calificaciones/asignaturas?idGrupo=${idGrupo.value}&idPlan=${planEst.value}`;
  const res = await fetch(url);
  const { data } = await res.json();

  // Elimina los datos repetidos
  let noRepitData = [];
  let newData = [];

  data.forEach((item) => {
    if (!noRepitData.includes(item.CLAVEASIGNATURA)) {
      noRepitData.push(item.CLAVEASIGNATURA);
      newData.push(item);
    }
  });
  
  asignatura.innerHTML = "";
  let contentAsig = "<option selected disabled>-- Elija una opción --</option>";

  newData.map((item) => {
    contentAsig += `<option value="${item.CLAVEASIGNATURA}">`;
    contentAsig += `${item.NOMBREASIGNATURA}`;
    contentAsig += "</option>";
  });

  asignatura.innerHTML = contentAsig;
};

asignatura.addEventListener("change", async (e) => {
  console.log(e.target.value);

  const claveAsig = e.target.value;

  let url =
    pathApi +
    `/asignaturas/alumnos?idGrupo=${idGrupo.value}&idPlan=${planEst.value}&claveAsig=${claveAsig}`;

  const res = await fetch(url);
  const { data, error } = await res.json();

  if(error) {
    table.innerHTML = "<tr><td>Hubo un error</td></tr>"
    return;
  }

  table.innerHTML = "";
  let content = "";

  data.forEach(item => {
    content += "<tr>";
    content += `<td>${item.PATERNO} ${item.MATERNO} ${item.NOMBRE}</td>`;
    content += `<td>${item.CALIFICACION}</td>`;
    content += `<td>Ordinario</td>`;
    content += "<tr>";
  });

  table.innerHTML = content;

});
