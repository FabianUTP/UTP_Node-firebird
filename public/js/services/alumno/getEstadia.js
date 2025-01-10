const numalumno = document.getElementById("numalumno");
const cuatri = document.getElementById("cuatrimestre");
const table = document.getElementById("table-content");
const load = document.getElementById("loading");

const getCalifi = async () => {
  let url = `/api/calificaciones?numalumno=${numalumno.value}&cuatri=${cuatri.value}`;

  table.innerHTML = "";

  load.style.display = "block";

  const res = await fetch(url);
  const { data } = await res.json();
  load.style.display = "none";

  let content = "";

  data.map((item) => {
    if (
      (item.ID_EVAL === "A") & (item.CALIFICACION <= 7) ||
      (item.ID_EVAL === "B") & (item.CALIFICACION < 80)
    ) {
      content += `<tr class="bg-danger text-white">`;
    } else {
      content += "<tr>";
    }
    content += `<td>${item.NOMBREASIGNATURA}</td>`;
    content += `<td>${item.CALIFICACION}</td>`;
    content += "</tr>";
  });

  table.innerHTML = content;
};
