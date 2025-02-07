function descargarTablaExcel() {
  try {
    // Obtener los datos de la asignatura y el grupo
    const asignaturaElement = document.getElementById("asig");
    const grupoElement = document.getElementById("grupo");

    if (!asignaturaElement || !grupoElement) {
      throw new Error("No se encontraron los datos de la asignatura o grupo en el DOM.");
    }

    const asignatura = asignaturaElement.textContent.replace("Asignatura: ", "").trim();
    const grupo = grupoElement.textContent.replace("Grupo: ", "").trim();

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
      [`Asignatura: ${asignatura}`],
      [`Grupo: ${grupo}`],
      [],
      ["#", "Nombre", "Matrícula", "Calificación"],
      ...data
    ];

    const ws = XLSX.utils.aoa_to_sheet(wsData);
    ws["!cols"] = [{ wch: 5 }, { wch: 30 }, { wch: 15 }, { wch: 15 }];

    XLSX.utils.book_append_sheet(wb, ws, "Calificaciones");

    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });

    // Limpiar el nombre de la asignatura para que sea un nombre válido de archivo
    const asignaturaLimpia = asignatura.replace(/[^a-zA-Z0-9]/g, "_"); // Reemplaza caracteres especiales con "_"
    
    // Definir el nombre del archivo con la asignatura
    const nombreArchivo = `Calificaciones_${asignaturaLimpia}.xlsx`;

    saveAs(new Blob([wbout], { type: "application/octet-stream" }), nombreArchivo);

    alert(`Archivo Excel generado correctamente: ${nombreArchivo}`);
  } catch (error) {
    console.error("Error al generar el archivo Excel:", error);
    alert(`Error: ${error.message}`);
  }
}
