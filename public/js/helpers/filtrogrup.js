const statusSelect = document.getElementById("estatus_actual");
const statusAlumno = document.getElementById("status");

const getStatus = async () => {
  const url = `/api/estatus`;
  const res = await fetch(url);
  const { data } = await res.json();
  return data;
};

const setStatusAlumno = async () => {
  let statusApi = await getStatus();

  let statusAlumnoActual = statusApi.filter(
    (item) => item.STATUS === statusAlumno.value
  );

  let content = `<option selected value="${statusAlumnoActual[0]?.STATUS}">${statusAlumnoActual[0]?.DESCRIPCION}</option>`;

  statusApi.forEach(item => {
    content += `<option value="${item.STATUS}">${item.DESCRIPCION}</option>`
  })

  statusSelect.innerHTML = content;

  changeStatus()
};

const changeStatus = () => {
  // option => es valor del <select> seleccionado
  // show => es el id del <div> a mostrar
  const filterStatusOptions = [
    {
      option: ["S", "A"],
      show: "ingreso_tsu",
    },
    {
      option: ["C", "BA", "N", "D"],
      show: "motivo_baja",
    },
  ];

  const valueSelected = statusSelect.value;

  filterStatusOptions.forEach((item) => {
    if (item.option.includes(valueSelected)) {
      document.getElementById(item.show).classList.remove("d-none");
    } else {
      document.getElementById(item.show).classList.add("d-none");
    }
  });
};

setStatusAlumno();
