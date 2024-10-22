const idplan = document.getElementById("idPlan");
const table = document.getElementById("table-content");

async function getPlanesAsig() {
  let url = `/api/planes/${idplan.value}/asig`;
  const res = await fetch(url);
  const data = await res.json();

  let content = "";
  data.data.forEach((item,index) => {
    content += `<tr onclick="window.location.href=window.location.href+'/${item.CLAVEASIGNATURA}'">`;
    content += `<td>${index + 1} </td>`;
    content += `<td>${item.ID_ETAPA} </td>`;
    content += `<td>${item.CLAVEASIGNATURA}</td>`;
    content += `<td>${item.NOMBREASIGNATURA}</td>`;
    content += "</tr>";
  });
  table.innerHTML = content;
}

getPlanesAsig();
