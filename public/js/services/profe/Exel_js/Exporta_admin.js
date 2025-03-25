function descargarTablaExcel() {
    try {
        // Verificar si la librería XLSX está disponible
        if (typeof XLSX === 'undefined') {
            throw new Error("La librería XLSX no está cargada correctamente");
        }

        // Obtener las columnas visibles
        const columnasSeleccionadas = columnas.filter(col => columnasVisibles[col.id]);

        if (columnasSeleccionadas.length === 0) {
            alert("Debe seleccionar al menos una columna para exportar.");
            return;
        }

        // Obtener datos de la tabla
        const rows = Array.from(document.querySelectorAll("#table-container tr"));
        if (rows.length === 0) {
            throw new Error("No se encontraron datos para exportar");
        }

        const data = rows.map((row) => {
            const cells = Array.from(row.querySelectorAll("td"));
            return columnasSeleccionadas.map((col) => {
                const colIndex = columnas.findIndex(c => c.id === col.id);
                if (colIndex === -1 || colIndex >= cells.length) return "";
                
                const cell = cells[colIndex];
                const input = cell.querySelector("input");
                return input ? input.value.trim() : cell.textContent.trim();
            });
        });

        // Crear libro Excel
        const wb = XLSX.utils.book_new();
        const wsData = [
            columnasSeleccionadas.map(col => col.nombre),
            ...data
        ];

        const ws = XLSX.utils.aoa_to_sheet(wsData);
        
        // Ajustar anchos de columna
        ws['!cols'] = columnasSeleccionadas.map(() => ({ wch: 20 }));
        
        XLSX.utils.book_append_sheet(wb, ws, "Datos");

        // Generar archivo
        const wbout = XLSX.write(wb, { 
            bookType: "xlsx", 
            type: "array",
            cellStyles: true 
        });

        // Descargar archivo
        const blob = new Blob([wbout], { type: "application/octet-stream" });
        const fileName = `Datos_${new Date().toISOString().slice(0, 10)}.xlsx`;
        
        // Usar FileSaver.js para la descarga
        if (typeof saveAs !== 'undefined') {
            saveAs(blob, fileName);
            alert(`Archivo ${fileName} generado correctamente`);
        } else {
            // Alternativa si FileSaver no está disponible
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = fileName;
            link.click();
            setTimeout(() => URL.revokeObjectURL(link.href), 100);
        }
    } catch (error) {
        console.error("Error en descargarTablaExcel:", error);
        alert(`Error al generar el Excel: ${error.message}`);
    }
}