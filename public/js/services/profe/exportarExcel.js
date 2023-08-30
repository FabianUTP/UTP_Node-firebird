function descargarTablaExcel() {
  // Obtener los datos del profesor
  const nombreProfesor =  document.querySelector("#datosProfesor h4").textContent;
  const asignatura = document.querySelector("#asig").textContent;
  const grupo = document.querySelector("#grupo").textContent;

  // Obtener los datos de la tabla
  const table = document.querySelector("#table-content");
  const rows = Array.from(table.getElementsByTagName("tr"));
  const data = rows.map(row => Array.from(row.getElementsByTagName("td")).map(cell => cell.textContent));

  // Crear el objeto Excel
  const wb = XLSX.utils.book_new();
  
  // Modificar wsData para agregar 6 filas vacías antes de los datos de la tabla
  const wsData = [
    [ nombreProfesor ],
    [ asignatura ],
    [ grupo ],
    [],
    [],
    [],
    [],
    [ "#", "Nombre", "Matricula", "Calificación" ], // Encabezados de la tabla
    ...data
  ];
  
  const ws = XLSX.utils.aoa_to_sheet(wsData);
  XLSX.utils.book_append_sheet(wb, ws, "Calificaciones");

  // Guardar el archivo Excel
  const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  saveAs(new Blob([wbout], { type: "application/octet-stream" }), "Calificaciones.xlsx");
};
