function descargarTablaExcel() {
  try {
    // Obtener los datos del profesor, asignatura y grupo
    const nombreProfesorElement = document.querySelector("#datosProfesor");
    const asignaturaElement = document.querySelector("#asig");
    const grupoElement = document.querySelector("#grupo");

    if (!nombreProfesorElement || !asignaturaElement || !grupoElement) {
      throw new Error("No se encontraron los datos del profesor, asignatura o grupo en el DOM.");
    }

    const nombreProfesor = nombreProfesorElement.textContent.trim();
    const asignatura = asignaturaElement.textContent.trim();
    const grupo = grupoElement.textContent.trim();

    if (!nombreProfesor || !asignatura || !grupo) {
      throw new Error("Faltan datos importantes: profesor, asignatura o grupo.");
    }

    // Obtener los datos de la tabla
    const table = document.querySelector("#table-content");
    const rows = Array.from(table.getElementsByTagName("tr"));
    const data = rows.map(row => Array.from(row.getElementsByTagName("td")).map(cell => cell.textContent.trim()));

    if (data.length === 0) {
      throw new Error("La tabla no tiene datos.");
    }

    // Crear un nuevo libro de trabajo de Excel
    const wb = XLSX.utils.book_new();

    // Crear la estructura de los datos
    const wsData = [
      [`Profesor: ${nombreProfesor}`],
      [`Asignatura: ${asignatura}`],
      [`Grupo: ${grupo}`],
      [],
      ["#", "Nombre", "Matrícula", "Calificación"], // Encabezados
      ...data // Los datos de la tabla
    ];

    // Convertir los datos a una hoja de trabajo
    const ws = XLSX.utils.aoa_to_sheet(wsData);

    // Aplicar estilos personalizados
    ws["!cols"] = [
      { wch: 5 },  // Ancho de la columna #
      { wch: 30 }, // Ancho de la columna Nombre
      { wch: 15 }, // Ancho de la columna Matrícula
      { wch: 15 }  // Ancho de la columna Calificación
    ];

    const range = XLSX.utils.decode_range(ws["!ref"]);
    for (let row = range.s.r; row <= range.e.r; row++) {
      for (let col = range.s.c; col <= range.e.c; col++) {
        const cellRef = XLSX.utils.encode_cell({ r: row, c: col });
        const cell = ws[cellRef];

        if (row === 4) {
          // Aplicar estilos a los encabezados
          if (cell) {
            cell.s = {
              font: { bold: true, color: { rgb: "FFFFFF" }, sz: 12 }, // Texto en negrita, blanco
              fill: { fgColor: { rgb: "007BFF" } }, // Fondo azul
              alignment: { horizontal: "center", vertical: "center" },
              border: {
                top: { style: "thin", color: { rgb: "000000" } },
                right: { style: "thin", color: { rgb: "000000" } },
                bottom: { style: "thin", color: { rgb: "000000" } },
                left: { style: "thin", color: { rgb: "000000" } }
              }
            };
          }
        } else if (row > 4) {
          // Aplicar estilos a las filas de datos
          if (cell) {
            cell.s = {
              font: { sz: 11, color: { rgb: "000000" } },
              alignment: { horizontal: "center", vertical: "center" },
              border: {
                top: { style: "thin", color: { rgb: "CCCCCC" } },
                right: { style: "thin", color: { rgb: "CCCCCC" } },
                bottom: { style: "thin", color: { rgb: "CCCCCC" } },
                left: { style: "thin", color: { rgb: "CCCCCC" } }
              }
            };
          }
        }
      }
    }

    // Agregar la hoja al libro
    XLSX.utils.book_append_sheet(wb, ws, "Calificaciones");

    // Guardar el archivo Excel
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([wbout], { type: "application/octet-stream" }), "Calificaciones.xlsx");

    alert("Archivo Excel generado correctamente.");
  } catch (error) {
    console.error("Error al generar el archivo Excel:", error);
    alert(`Error: ${error.message}`);
  }
}
