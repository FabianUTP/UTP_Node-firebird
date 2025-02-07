function descargarTablaExcel() {
  try {
      // Obtener los datos del profesor, asignatura y grupo desde el DOM
      const nombreProfesorElement = document.querySelector("#claveProfesor");
      const asignaturaElement = document.querySelector("#eval-select");
      const grupoElement = document.querySelector("#idGrupo");

      if (!nombreProfesorElement || !asignaturaElement || !grupoElement) {
          throw new Error("No se encontraron los datos del profesor, asignatura o grupo en el DOM.");
      }

      const nombreProfesor = nombreProfesorElement.textContent.trim();
      const asignatura = asignaturaElement.options[asignaturaElement.selectedIndex].text.trim();
      const grupo = grupoElement.value.trim();

      if (!nombreProfesor || !asignatura || !grupo) {
          throw new Error("Faltan datos importantes: profesor, asignatura o grupo.");
      }

      // Obtener los datos de la tabla
      const rows = Array.from(document.querySelectorAll("#table-container tr"));

      const data = rows.map((row, index) => {
          const cells = Array.from(row.getElementsByTagName("td"));
          const calificacionInput = row.querySelector('.calificacion-input'); // Obtener la calificación editada

          if (cells.length >= 3 && calificacionInput) {
              const nombre = cells[1].textContent.trim();
              const matricula = cells[2].textContent.trim();
              const calificacion = calificacionInput.value.trim();

              return [index + 1, nombre, matricula, calificacion];
          }
          return null;
      }).filter(row => row !== null);

      if (data.length === 0) {
          throw new Error("La tabla no tiene datos.");
      }

      // Crear un nuevo libro de trabajo de Excel
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
      ws["!cols"] = [
          { wch: 5 }, { wch: 30 }, { wch: 15 }, { wch: 15 } 
      ];

      XLSX.utils.book_append_sheet(wb, ws, "Calificaciones");

      // Limpiar caracteres especiales del nombre de la asignatura y grupo para evitar errores en el nombre del archivo
      const asignaturaLimpia = asignatura.replace(/[^a-zA-Z0-9]/g, "_");
      const grupoLimpio = grupo.replace(/[^a-zA-Z0-9]/g, "_");

      // Nombre del archivo con asignatura y grupo
      const nombreArchivo = `Calificaciones_${asignaturaLimpia}_${grupoLimpio}.xlsx`;

      const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
      saveAs(new Blob([wbout], { type: "application/octet-stream" }), nombreArchivo);

      alert(`Archivo Excel generado correctamente: ${nombreArchivo}`);
  } catch (error) {
      console.error("Error al generar el archivo Excel:", error);
      alert(`Error: ${error.message}`);
  }
}
