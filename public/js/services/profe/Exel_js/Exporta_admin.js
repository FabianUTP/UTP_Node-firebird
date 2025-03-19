function descargarTablaExcel() {
    try {
        // Obtener las columnas visibles
        const columnasSeleccionadas = columnas.filter(col => columnasVisibles[col.id]);

        // Si no hay columnas visibles seleccionadas, mostramos una alerta
        if (columnasSeleccionadas.length === 0) {
            alert("Debe seleccionar al menos una columna para exportar.");
            return;
        }

        // Obtener los datos de la tabla
        const rows = Array.from(document.querySelectorAll("#table-container tr"));
        const data = rows.map((row) => {
            const cells = Array.from(row.querySelectorAll("td"));
            
            // Filtrar solo las celdas correspondientes a las columnas visibles
            const rowData = columnasSeleccionadas.map((col) => {
                const cell = cells.find((cell, index) => index === columnas.findIndex(column => column.id === col.id));
                if (cell) {
                    const input = cell.querySelector("input");
                    return input ? input.value.trim() : cell.textContent.trim();
                }
                return "";  // En caso de que la celda esté vacía
            });

            return rowData;
        });

        // Crear un nuevo libro de Excel
        const wb = XLSX.utils.book_new();

        // Generar las cabeceras solo con las columnas seleccionadas
        const wsData = data.length > 0
            ? [
                columnasSeleccionadas.map(col => col.nombre),  // Usamos los nombres de las columnas visibles seleccionadas
                ...data
            ]
            : [columnasSeleccionadas.map(col => col.nombre)];  // Solo cabecera si no hay datos

        const ws = XLSX.utils.aoa_to_sheet(wsData);
        ws["!cols"] = columnasSeleccionadas.map(() => ({ wch: 20 })); // Ajuste de ancho de columnas

        XLSX.utils.book_append_sheet(wb, ws, "Datos");

        const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });

        // Limpiar caracteres especiales del nombre del archivo
        const nombreArchivo = `Datos_${new Date().toISOString().slice(0, 10)}.xlsx`;

        saveAs(new Blob([wbout], { type: "application/octet-stream" }), nombreArchivo);

        alert(`Archivo Excel generado correctamente: ${nombreArchivo}`);
    } catch (error) {
        console.error("Error al generar el archivo Excel:", error);
        alert(`Error: ${error.message}`);
    }
}
