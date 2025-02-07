function descargarTablaExcel() {
  try {
    // Obtener los datos del profesor, asignatura y grupo
    const nombreProfesorElement = document.querySelector("#datosProfesor h5 b");
    const asignaturaElement = document.querySelector("#asig");
    const grupoElement = document.querySelector("#grupo");

    if (!nombreProfesorElement || !asignaturaElement || !grupoElement) {
      throw new Error("No se encontraron los datos del profesor, asignatura o grupo en el DOM.");
    }

    const nombreProfesor = nombreProfesorElement.textContent.trim();
    const asignatura = asignaturaElement.textContent.trim();
    const grupo = grupoElement.textContent.trim();

    console.log("Nombre Profesor:", nombreProfesor);
    console.log("Asignatura:", asignatura);
    console.log("Grupo:", grupo);

    // Obtener los datos de la tabla
    const rows = Array.from(document.querySelectorAll("#table-content tr"));
    const data = rows.map((row, index) => {
      const cells = row.querySelectorAll("td");
      const inputCalificacion = row.querySelector("input");

      if (cells.length >= 3) {
        const nombre = cells[1].textContent.trim();
        const matricula = cells[2].textContent.trim();
        const calificacion = inputCalificacion ? inputCalificacion.value.trim() : cells[3]?.textContent.trim();

        return [index + 1, nombre, matricula, calificacion];
      }
      return null;
    }).filter(row => row !== null);

    console.log("Datos de la tabla:", data);

    if (data.length === 0) {
      throw new Error("La tabla no tiene datos.");
    }

    // Crear un nuevo libro de Excel
    const wb = XLSX.utils.book_new();
    const wsData = [
      [`Profesor: ${nombreProfesor}`],
      [`Asignatura: ${asignatura}`],
      [`Grupo: ${grupo}`],
      [],
      [],
      [],
      [],
      ["#", "Nombre", "Matrícula", "Calificación"],
      ...data
    ];

    const ws = XLSX.utils.aoa_to_sheet(wsData);
    ws["!cols"] = [{ wch: 5 }, { wch: 30 }, { wch: 15 }, { wch: 15 }];

    XLSX.utils.book_append_sheet(wb, ws, "Calificaciones");

    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });

    // Limpiar caracteres especiales del nombre del archivo
    const asignaturaLimpia = asignatura.replace(/[^a-zA-Z0-9]/g, "_");
    const grupoLimpio = grupo.replace(/[^a-zA-Z0-9]/g, "_");

    // Definir el nombre del archivo con la asignatura y grupo
    const nombreArchivo = `Calificaciones_${asignaturaLimpia}_${grupoLimpio}.xlsx`;

    saveAs(new Blob([wbout], { type: "application/octet-stream" }), nombreArchivo);

    alert(`Archivo Excel generado correctamente: ${nombreArchivo}`);
  } catch (error) {
    console.error("Error al generar el archivo Excel:", error);
    alert(`Error: ${error.message}`);
  }
}
