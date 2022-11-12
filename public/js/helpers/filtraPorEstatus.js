const statusOption = document.getElementById("estatus_actual");

// option => es valor del <select> seleccionado
// show => es el id del <div> a mostrar 

const filterStatus = [
  {
    option: ["aspirante", "activo_tsu"],
    show: "ingreso_tsu",
  },
  {
    option: ["baja_tem", "baja_def", "no_admitido", "deser"],
    show: "motivo_baja",
  },
];

statusOption.addEventListener("change", (e) => {
  const valueSelected = e.target.value;

  filterStatus.forEach((item) => {
    if (item.option.includes(valueSelected)) {
      document.getElementById(item.show).classList.remove("d-none");
    } else {
      document.getElementById(item.show).classList.add("d-none");
    }
  });
});
