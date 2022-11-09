const numalumno = document.getElementById("numalumno");
const tipoEval = document.getElementById("tipo_eval");
const table = document.getElementById("table-content");
const loading = document.getElementById("loading");

const getCalifi = async () => {
  let url = "/api/calificaciones/" + numalumno.value;
  url += "?eval=" + tipoEval.value;

  table.innerHTML = "";
  loading.style.display = "block";

  const res = await fetch(url);
  const { data } = await res.json();
  loading.style.display = "none";

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
