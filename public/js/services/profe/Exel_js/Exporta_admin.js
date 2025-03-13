function descargarTablaExcel() {
    try {
        // Obtener los datos de las filas de la tabla, ignorando la cabecera
        const rows = Array.from(document.querySelectorAll("#table-container tbody tr"));

        const data = rows.map((row, index) => {
            const cells = Array.from(row.getElementsByTagName("td"));
            const estadoCivilInput = row.querySelector(".form-control"); // Obtener el estado civil editable

            if (cells.length >= 3 && estadoCivilInput) {
                // Extraer los datos
                const nombre = cells[0].textContent.trim(); // Nombre del alumno
                const matricula = cells[1].textContent.trim(); // Matrícula del alumno
                const estadoCivil = estadoCivilInput.value.trim(); // Estado Civil editable

                // Retornar los datos para la exportación
                return [
                    index + 1,  // Índice en la tabla (número de fila)
                    nombre,     // Nombre del alumno
                    matricula,  // Matrícula del alumno
                    estadoCivil // Estado civil editable
                ];
            }
            return null;
        }).filter(row => row !== null);

        if (data.length === 0) {
            throw new Error("La tabla no tiene datos.");
        }

        // Crear un nuevo libro de trabajo de Excel
        const wb = XLSX.utils.book_new();
        const wsData = [
            ["#", "Nombre", "Matrícula", "Estado Civil"], // Cabeceras para el archivo
            ...data
        ];

        const ws = XLSX.utils.aoa_to_sheet(wsData);

        // Configuración del ancho de las columnas
        ws["!cols"] = [
            { wch: 5 }, // Ancho de la columna para el índice
            { wch: 20 }, // Ancho de la columna para el nombre
            { wch: 15 }, // Ancho de la columna para la matrícula
            { wch: 15 }  // Ancho de la columna para el estado civil
        ];

        // Añadir la hoja de trabajo al libro
        XLSX.utils.book_append_sheet(wb, ws, "Datos Alumnos");

        // Nombre del archivo
        const nombreArchivo = `Datos_Alumnos.xlsx`;

        // Escribir el archivo y exportarlo
        const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        saveAs(new Blob([wbout], { type: "application/octet-stream" }), nombreArchivo);

        alert(`Archivo Excel generado correctamente: ${nombreArchivo}`);
    } catch (error) {
        console.error("Error al generar el archivo Excel:", error);
        alert(`Error: ${error.message}`);
    }
}
