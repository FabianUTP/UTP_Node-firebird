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
      [],
      [],
      [],
      ["#", "Nombre", "Matrícula", "Calificación"], // Encabezados
      ...data // Los datos de la tabla
    ];

    // Convertir los datos a una hoja de trabajo
    const ws = XLSX.utils.aoa_to_sheet(wsData);

    // Estilo para los encabezados (color, fuente, etc.)
    const headerStyle = {
      font: { bold: true, color: { rgb: "FFFFFF" }, sz: 12 },  // Texto en negrita, color blanco, tamaño 12
      fill: { fgColor: { rgb: "007bff" } },  // Color de fondo azul (similar al de la página)
      alignment: { horizontal: "center", vertical: "center" },
      border: {
        top: { style: "thin", color: { rgb: "000000" } },
        right: { style: "thin", color: { rgb: "000000" } },
        bottom: { style: "thin", color: { rgb: "000000" } },
        left: { style: "thin", color: { rgb: "000000" } }
      }
    };

    // Estilo para las celdas de datos
    const rowStyle = {
      alignment: { horizontal: "center" },  // Alineación del texto
      border: {
        top: { style: "thin", color: { rgb: "000000" } },
        right: { style: "thin", color: { rgb: "000000" } },
        bottom: { style: "thin", color: { rgb: "000000" } },
        left: { style: "thin", color: { rgb: "000000" } }
      }
    };

    // Aplicar estilo a los encabezados
    for (let i = 0; i < 4; i++) {
      ws["A" + (8 + i)].s = headerStyle;
      ws["B" + (8 + i)].s = headerStyle;
      ws["C" + (8 + i)].s = headerStyle;
      ws["D" + (8 + i)].s = headerStyle;
    }

    // Aplicar estilo a las filas de datos
    let rowIndex = 9;  // Iniciar después de los encabezados
    data.forEach(row => {
      row.forEach((cell, i) => {
        let cellRef = XLSX.utils.encode_cell({ r: rowIndex, c: i });
        ws[cellRef] = { v: cell, s: rowStyle };
      });
      rowIndex++;
    });

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
