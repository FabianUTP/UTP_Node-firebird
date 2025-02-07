function descargarTablaExcel() {
    try {
      // Obtener los datos del profesor, asignatura y grupo desde el DOM
      const nombreProfesorElement = document.querySelector("#claveProfesor"); // El texto con el nombre del profesor
      const asignaturaElement = document.querySelector("#eval-select"); // Evaluación seleccionada
      const grupoElement = document.querySelector("#idGrupo");
  
      if (!nombreProfesorElement || !asignaturaElement || !grupoElement) {
        throw new Error("No se encontraron los datos del profesor, asignatura o grupo en el DOM.");
      }
  
      const nombreProfesor = nombreProfesorElement.textContent.trim();
      const asignatura = asignaturaElement.options[asignaturaElement.selectedIndex].text;
      const grupo = grupoElement.value.trim();
  
      if (!nombreProfesor || !asignatura || !grupo) {
        throw new Error("Faltan datos importantes: profesor, asignatura o grupo.");
      }
  
      // Obtener los datos de la tabla
      const rows = Array.from(document.querySelectorAll("#table-container tr"));
      
      // Mapear los datos de cada fila (los datos de los alumnos)
      const data = rows.map((row, index) => {
        const cells = Array.from(row.getElementsByTagName("td"));
        const calificacionInput = row.querySelector('.calificacion-input');  // Obtener la calificación editada
        
        if (cells.length === 5 && calificacionInput) {
          const nombre = cells[1].textContent.trim();
          const matricula = cells[2].textContent.trim();
          const calificacion = calificacionInput.value.trim(); // Obtener la calificación del input
  
          return [index + 1, nombre, matricula, calificacion]; // Solo guardamos nombre, matrícula y calificación
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
        [], // Espacio entre los metadatos y la tabla
        ["#", "Nombre", "Matrícula", "Calificación"], // Encabezados sin la columna de fecha
        ...data
      ];
  
      const ws = XLSX.utils.aoa_to_sheet(wsData);
      ws["!cols"] = [
        { wch: 5 }, { wch: 30 }, { wch: 15 }, { wch: 15 } // Ajustamos las columnas
      ];
  
      // Agregar la hoja al libro de trabajo con el nombre de la asignatura
      XLSX.utils.book_append_sheet(wb, ws, grupo);
  
      // Guardar el archivo Excel con el nombre de la asignatura
      const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
      saveAs(new Blob([wbout], { type: "application/octet-stream" }), `${grupo}.xlsx`);
  
      alert("Archivo Excel generado correctamente.");
    } catch (error) {
      console.error("Error al generar el archivo Excel:", error);
      alert(`Error: ${error.message}`);
    }
  }
  