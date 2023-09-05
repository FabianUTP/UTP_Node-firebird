const numalumno = document.getElementById("numalumno");
const tipoEval = document.getElementById("tipo_eval");
const cuatri = document.getElementById("cuatrimestre");
const table = document.getElementById("table-content");
const load = document.getElementById("loading");
const btnDescargar = document.querySelector(".btn-success");

const getCalifi = async () => {
  let url = "/api/calificaciones/" + numalumno.value;
  url += "?cuatri=" + cuatri.value;
  url += "&eval=" + tipoEval.value;

  table.innerHTML = "";

  load.style.display = "block";
  btnDescargar.style.display = "none";

  const res = await fetch(url);
  const { data } = await res.json();
  load.style.display = "none";

  if (data.length === 0) {
    // Cuatrimestre seleccionado no tiene calificaciones
    const alertContainer = document.createElement("div");
    alertContainer.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 9999;
      padding: 20px;
      background-color: #f8f8f8;
      border: 1px solid #ccc;
      border-radius: 5px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
      font-family: Arial, sans-serif;
      color: #333;
      display: flex;
      flex-direction: column;
      align-items: center;
    `;

    const alertMessage = document.createElement("div");
    alertMessage.textContent = "El cuatrimestre seleccionado no tiene calificaciones.";

    const closeButton = document.createElement("button");
    closeButton.textContent = "Cerrar";
    closeButton.style.cssText = `
      margin-top: 10px;
      padding: 8px 20px;
      background-color: #4CAF50;
      border: none;
      border-radius: 4px;
      color: white;
      cursor: pointer;
    `;
    closeButton.addEventListener("click", () => {
      alertContainer.remove();
    });

    alertContainer.appendChild(alertMessage);
    alertContainer.appendChild(closeButton);

    document.body.appendChild(alertContainer);

    return;
  }

  let content = "";

  data.map((item) => {
    if (
      (item.ID_EVAL === "A" && item.CALIFICACION <= 7) ||
      (item.ID_EVAL === "B" && item.CALIFICACION < 80)
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
  btnDescargar.style.display = "block";
};
