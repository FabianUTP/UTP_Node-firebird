/**
 * =============================================
 * SISTEMA DE GESTIÓN DE ALUMNOS - DOCUMENTACIÓN
 * =============================================
 * 
 * Este módulo gestiona la visualización y edición de datos de alumnos
 * mediante una interfaz tabular con capacidad para:
 * - Mostrar/ocultar columnas
 * - Editar campos permitidos
 * - Guardar cambios en el servidor
 * - Ordenar datos
 */

// --------------------------------------------------
// CONFIGURACIÓN INICIAL
// --------------------------------------------------

/**
 * Elementos del DOM utilizados en la aplicación
 * @type {Object}
 * @property {HTMLElement} table - Contenedor principal de la tabla
 * @property {HTMLElement} tableHeader - Sección de encabezados de la tabla
 * @property {HTMLElement} columnToggles - Contenedor de controles para mostrar/ocultar columnas
 * @property {HTMLElement} load - Elemento visual de carga
 * @property {HTMLElement} saveAllBtn - Botón para guardar todos los cambios
 */
const elements = {
    table: document.getElementById("table-container"),
    tableHeader: document.getElementById("table-header"),
    columnToggles: document.getElementById("column-toggles"),
    load: document.getElementById("load"),
    saveAllBtn: document.getElementById("save-all-btn")
};

/**
 * Estado global de la aplicación
 * @type {Object}
 * @property {number} skip - Registros a omitir (para paginación)
 * @property {string} orderBy - Campo actual para ordenación
 * @property {string} sort - Dirección de ordenación ('asc' o 'desc')
 * @property {Object} cambios - Cambios pendientes de guardar {alumnoId: {campo: valor}}
 * @property {Object} columnasVisibles - Columnas visibles {colId: boolean}
 */
const state = {
    skip: 0,
    orderBy: "matricula",
    sort: "asc",
    cambios: {},
    columnasVisibles: {}
};
// --------------------------------------------------
// COLUMNAS DE DATOS -->TABLA
// --------------------------------------------------
const columnas = [
    { id: "NUMEROALUMNO", nombre: "NUMEROALUMNO", visible: false, editable: false },
    { id: "MATRICULA", nombre: "MATRICULA", visible: false, editable: false },
    { id: "MATRICULA_OFICIAL", nombre: "MATRICULA_OFICIAL", visible: false, editable: false },
    { id: "NOMBRE", nombre: "NOMBRE", visible: false, editable: false },
    { id: "PATERNO", nombre: "PATERNO", visible: false },
    { id: "MATERNO", nombre: "MATERNO", visible: false },
    { id: "TIPO_SEG_MED", nombre: "TIPO_SEG_MED", visible: false },
    { id: "NUM_IMSS", nombre: "NUM_IMSS", visible: false },
    { id: "NUM_IMSS_VERIFICADOR", nombre: "NUM_IMSS_VERIFICADOR", visible: false },
    { id: "GENERO", nombre: "GENERO", visible: false },
    { id: "NIVEL", nombre: "NIVEL", visible: false },
    { id: "GRADO", nombre: "GRADO", visible: false },
    { id: "SUBNIVEL", nombre: "SUBNIVEL", visible: false },
    { id: "STATUS", nombre: "STATUS", visible: false },
    { id: "CLAVE_CIUDADANA", nombre: "CLAVE_CIUDADANA", visible: false },
    { id: "ESTADO_CIVIL", nombre: "ESTADO_CIVIL", visible: false },
    { id: "FECHA_NACIMIENTO", nombre: "FECHA_NACIMIENTO", visible: false },
    { id: "DOMICILIO", nombre: "DOMICILIO", visible: false },
    { id: "ENTRE_CALLES", nombre: "ENTRE_CALLES", visible: false },
    { id: "CP", nombre: "CP", visible: false },
    { id: "CIUDAD", nombre: "CIUDAD", visible: false },
    { id: "ESTADO", nombre: "ESTADO", visible: false },
    { id: "LATITUD", nombre: "LATITUD", visible: false },
    { id: "LOGINTUD", nombre: "LOGINTUD", visible: false },
    { id: "TELEFONO", nombre: "TELEFONO", visible: false },
    { id: "CELULAR", nombre: "CELULAR", visible: false },
    { id: "TELEFONOTRABAJO", nombre: "TELEFONOTRABAJO", visible: false },
    { id: "NOMBRETUTOR", nombre: "NOMBRETUTOR", visible: false },
    { id: "PARENTESCO", nombre: "PARENTESCO", visible: false },
    { id: "OBSERVACIONES", nombre: "OBSERVACIONES", visible: false },
    { id: "ADICIONALES", nombre: "ADICIONALES", visible: false },
    { id: "EMAIL", nombre: "EMAIL", visible: false },
    { id: "EMAIL_ALTERNO", nombre: "EMAIL_ALTERNO", visible: false },
    { id: "FECHA_BAJA", nombre: "FECHA_BAJA", visible: false },
    { id: "ANIOEGRESO", nombre: "ANIOEGRESO", visible: false },
    { id: "LUGAR_NACIMIENTO", nombre: "LUGAR_NACIMIENTO", visible: false },
    { id: "ESTADO_NACIMIENTO", nombre: "ESTADO_NACIMIENTO", visible: false },
    { id: "NACIONALIDAD", nombre: "NACIONALIDAD", visible: false },
    { id: "ESCUELA_PROCEDENCIA", nombre: "ESCUELA DE PROCEDENCIA", visible: false },
    { id: "ESCOLARIDAD", nombre: "ESCOLARIDAD", visible: false },
    { id: "ESTADO_ESCOLARIDAD", nombre: "ESTADO_ESCOLARIDAD", visible: false },
    { id: "FECHA_EGRESO", nombre: "FECHA_EGRESO", visible: false },
    { id: "FECHA_INGRESO", nombre: "FECHA_INGRESO", visible: false },
    { id: "FECHA_CREACION", nombre: "FECHA_CREACION", visible: false },
    { id: "FECHA_ACTUALIZACION", nombre: "FECHA_ACTUALIZACION", visible: false },
    { id: "PROMEDIO_ESC_ANTERIOR", nombre: "PROMEDIO_ESC_ANTERIOR", visible: false },
    { id: "PROMEDIO_EX_ADMISION", nombre: "PROMEDIO_EX_ADMISION", visible: false },
    { id: "CERTIFICADO", nombre: "CERTIFICADO", visible: false },
    { id: "SITUACION_CERTIFICADO", nombre: "SITUACION_CERTIFICADO", visible: false },
    { id: "ALUMNO_ALTAINICIAL", nombre: "ALUMNO_ALTAINICIAL", visible: false },
    { id: "ALUMNO_ALTAFINAL", nombre: "ALUMNO_ALTAFINAL", visible: false },
    { id: "ALUMNO_ALTAPERIODO", nombre: "ALUMNO_ALTAPERIODO", visible: false },
    { id: "FECHA_PROSPECCION", nombre: "FECHA_PROSPECCION", visible: false },
    { id: "PROSPECCION_FINAL", nombre: "PROSPECCION_FINAL", visible: false },
    { id: "PROSPECCION_INICIAL", nombre: "PROSPECCION_INICIAL", visible: false },
    { id: "PROSPECCION_PERIODO", nombre: "PROSPECCION_PERIODO", visible: false },
    { id: "EGRESO_INICIAL", nombre: "EGRESO_INICIAL", visible: false },
    { id: "EGRESO_FINAL", nombre: "EGRESO_FINAL", visible: false },
    { id: "EGRESO_PERIODO", nombre: "EGRESO_PERIODO", visible: false },
    { id: "BECA", nombre: "BECA", visible: false },
    { id: "CUENTA_BECA", nombre: "CUENTA_BECA", visible: false },
    { id: "TARJETA_BECA", nombre: "TARJETA_BECA", visible: false },
    { id: "PESO_KG", nombre: "PESO_KG", visible: false },
    { id: "CONTACTO", nombre: "CONTACTO", visible: false },
    { id: "PARENTESCO_CONTACTO", nombre: "PARENTESCO_CONTACTO", visible: false },
    { id: "TEL_CONTACTO", nombre: "TEL_CONTACTO", visible: false },
    { id: "TIPO_SEG_MED", nombre: "TIPO_SEG_MED", visible: false },
    { id: "LENGUAINDIGENA", nombre: "LENGUAINDIGENA", visible: false },
    { id: "DISCAPACIDAD", nombre: "DISCAPACIDAD", visible: false },
    { id: "ENFERNEDAD", nombre: "ENFERNEDAD", visible: false },
    { id: "ALERGIAS", nombre: "ALERGIAS", visible: false },
    { id: "NOMBREPADRE", nombre: "NOMBREPADRE", visible: false },
    { id: "NOMBREMADRE", nombre: "NOMBREMADRE", visible: false },
    { id: "PERSONASDEPENDENINGRESO", nombre: "PERSONASDEPENDENINGRESO", visible: false },
    { id: "VIVENCASA", nombre: "VIVENCASA", visible: false },
    { id: "HERMANOS", nombre: "HERMANOS", visible: false },
    { id: "LUGARNACIMIENTO", nombre: "LUGARNACIMIENTO", visible: false },
    { id: "HERMANOSESTUDIAN", nombre: "HERMANOSESTUDIAN", visible: false },
    { id: "HORARIOTRABAJAS", nombre: "HORARIOTRABAJAS", visible: false },
    { id: "ESCOLARIDADCONYUGE", nombre: "ESCOLARIDADCONYUGE", visible: false },
    { id: "HIJOS0A5", nombre: "HIJOS0A5", visible: false },
    { id: "HIJOS6A12", nombre: "HIJOS6A12", visible: false },
    { id: "HIJOS13A18", nombre: "HIJOS13A18", visible: false },
    { id: "HIJOSMAYORES", nombre: "HIJOSMAYORES", visible: false },
    { id: "CARRERA_ORIGEN_MOV_ACAD", nombre: "CARRERA_ORIGEN_MOV_ACAD", visible: false },
    { id: "FOLIO_CENEVAL", nombre: "FOLIO_CENEVAL", visible: false },
    { id: "FOLIO_ACTA_EXEN_TSU", nombre: "FOLIO_ACTA_EXEN_TSU", visible: false },
    { id: "LIBRO_ACTA_EXEN_TSU", nombre: "LIBRO_ACTA_EXEN_TSU", visible: false },
    { id: "FOJAS_ACTA_EXEN_TSU", nombre: "FOJAS_ACTA_EXEN_TSU", visible: false },
    { id: "FOLIO_CERTIFICADO_TSU", nombre: "FOLIO_CERTIFICADO_TSU", visible: false },
    { id: "LIBRO_CERTIFICADO_TSU", nombre: "LIBRO_CERTIFICADO_TSU", visible: false },
    { id: "FOJAS_CERTIFICADO_TSU", nombre: "FOJAS_CERTIFICADO_TSU", visible: false },
    { id: "FOLIO_TITULACION_TSU", nombre: "FOLIO_TITULACION_TSU", visible: false },
    { id: "LIBRO_TITULACION_TSU", nombre: "LIBRO_TITULACION_TSU", visible: false },
    { id: "FOJA_TITULACION_TSU", nombre: "FOJA_TITULACION_TSU ", visible: false },
    { id: "FOLIO_TITULACION", nombre: "FOLIO_TITULACION", visible: false },
    { id: "FECHA_TRAMITE", nombre: "FECHA_TRAMITE", visible: false },
    { id: "TITULACION_FOLIOPAGO", nombre: "TITULACION_FOLIOPAGO", visible: false },
    { id: "EMPRESA_NR", nombre: "EMPRESA_NR", visible: false },
    { id: "ASESOR_EMPRESARIAL", nombre: "ASESOR_EMPRESARIAL", visible: false },
    { id: "ASESOR_EMPRESARIAL_INT", nombre: "ASESOR_EMPRESARIAL_INT", visible: false },
    { id: "ESTADIA_INICIO", nombre: "ESTADIA_INICIO", visible: false },
    { id: "ESTADIA_TERMINO", nombre: "ESTADIA_TERMINO", visible: false },
    { id: "FOLIO_CSS", nombre: "FOLIO_CSS", visible: false },
    { id: "LIBRO_CSS", nombre: "LIBRO_CSS", visible: false },
    { id: "FOJAS_CSS", nombre: "FOJAS_CSS", visible: false },
    { id: "PROYECTO_NOMBRE", nombre: "PROYECTO_NOMBRE", visible: false },
    { id: "CAI_FECHA", nombre: "CAI_FECHA", visible: false },
    { id: "ASESOR_ACADEMICO", nombre: "ASESOR_ACADEMICO", visible: false },
    { id: "ASESOR_ACAD_EXT", nombre: "ASESOR_ACAD_EXT", visible: false },
    { id: "PROYECTO_OBS", nombre: "PROYECTO_OBS", visible: false },
    { id: "TRAMITE_COMPLETO", nombre: "TRAMITE_COMPLETO", visible: false },
    { id: "FOLIO_CEX", nombre: "FOLIO_CEX", visible: false },
    { id: "LIBRO_CEX", nombre: "LIBRO_CEX", visible: false },
    { id: "FOJAS_CEX", nombre: "FOJAS_CEX", visible: false },
    { id: "SOLICITUD_TITULACION_LIC", nombre: "SOLICITUD_TITULACION_LIC", visible: false },
    { id: "FOLIO_TITULACION_LIC", nombre: "FOLIO_TITULACION_LIC", visible: false },
    { id: "FECHA_TRAMITE_LIC", nombre: "FECHA_TRAMITE_LIC", visible: false },
    { id: "FOLIO_PAGO_TIT_LIC", nombre: "FOLIO_PAGO_TIT_LIC", visible: false },
    { id: "NUM_CEDULA_TSU", nombre: "NUM_CEDULA_TSU", visible: false },
    { id: "EMPRESA_ESTADIA_LIC", nombre: "EMPRESA_ESTADIA_LIC", visible: false },
    { id: "ASESOR_EMPRESARIAL_LIC", nombre: "ASESOR_EMPRESARIAL_LIC", visible: false },
    { id: "FECHA_INICIO_EST_LIC", nombre: "FECHA_INICIO_EST_LIC", visible: false },
    { id: "FECHA_FIN_EST_LIC", nombre: "FECHA_FIN_EST_LIC", visible: false },
    { id: "FECHA_LIBERACION_EST_LIC", nombre: "FECHA_LIBERACION_EST_LIC", visible: false },
    { id: "PROYECTO_EST_LIC", nombre: "PROYECTO_EST_LIC", visible: false },
    { id: "FECHA_AUTORIZACION_LIC", nombre: "FECHA_AUTORIZACION_LIC", visible: false },
    { id: "ASESOR_ACAD_LIC", nombre: "ASESOR_ACAD_LIC", visible: false },
    { id: "OBS_PROYECTO_LIC", nombre: "OBS_PROYECTO_LIC", visible: false },
    { id: "FECHA_INGRESO_LIC", nombre: "FECHA_INGRESO_LIC", visible: false },
    { id: "FECHA_EGRESO_LIC", nombre: "FECHA_EGRESO_LIC", visible: false },
    { id: "INICIO_BACH", nombre: "INICIO_BACH", visible: false },
    { id: "FIN_BACH", nombre: "FIN_BACH", visible: false },
    { id: "FOLIO_CERLIC", nombre: "FOLIO_CERLIC", visible: false },
    { id: "LIBRO_CERLIC", nombre: "LIBRO_CERLIC", visible: false },
    { id: "FOJA_CERLIC", nombre: "FOJA_CERLIC", visible: false },
    { id: "FOLIO_CSSLIC", nombre: "FOLIO_CSSLIC", visible: false },
    { id: "LIBRO_CSSLIC", nombre: "LIBRO_CSSLIC", visible: false },
    { id: "FOJA_CSSLIC", nombre: "FOJA_CSSLIC", visible: false },
    { id: "FOLIO_TITLIC", nombre: "FOLIO_TITLIC", visible: false },
    { id: "LIBRO_TITLIC", nombre: "LIBRO_TITLIC", visible: false },
    { id: "FOJA_TITLIC", nombre: "FOJA_TITLIC", visible: false },
    { id: "ALUMNO_PASSWORD", nombre: "ALUMNO_PASSWORD", visible: false },
    { id: "NUM_CEDULA_LIC", nombre: "NUM_CEDULA_LIC", visible: false },
    { id: "ESTADOCIVIL", nombre: "ESTADOCIVIL", visible: false },
];

// --------------------------------------------------
// UTILIDADES
// --------------------------------------------------

/**
 * Funciones de utilidad general
 * @type {Object}
 */
const utils = {
    /**
     * Formatea fecha de YYYY-MM-DD a DD/MM/YYYY para mostrar en inputs
     * @param {string} dateStr 
     * @returns {string} 
     */
    formatDateToInput: (dateStr) => dateStr ? dateStr.split("-").reverse().join("/") : "",

    /**
     * Formatea fecha de DD/MM/YYYY a YYYY-MM-DD para enviar a la base de datos
     * @param {string} dateStr
     * @returns {string} 
     */
    formatDateToDB: (dateStr) => dateStr ? dateStr.split("/").reverse().join("-") : ""
};

// --------------------------------------------------
// GESTIÓN DE TABLA
// --------------------------------------------------

/**
 * Controlador principal para la gestión de la tabla
 * @type {Object}
 */
const tableManager = {
    /**
     * Alterna la visibilidad de una columna
     * @param {string} columnId 
     */
    toggleColumnVisibility: (columnId) => {
        state.columnasVisibles[columnId] = !state.columnasVisibles[columnId];
        tableManager.renderTable();
    },

    /**
     * Renderiza la tabla actualizando las columnas visibles
     */
    renderTable: () => {

        const visibleColumns = columnas.filter(col => state.columnasVisibles[col.id]);
        elements.tableHeader.innerHTML = `<tr>${visibleColumns.map(col => `<th>${col.nombre}</th>`).join("")}</tr>`;
        Array.from(elements.table.querySelectorAll("tr")).forEach(row => {
            Array.from(row.querySelectorAll("td")).forEach(cell => {
                const colId = cell.dataset.columna;
                cell.classList.toggle("hidden-column", !state.columnasVisibles[colId]);
            });
        });
    },

    /**
     * Genera los controles para mostrar/ocultar columnas
     */
    generateColumnToggles: () => {
        elements.columnToggles.innerHTML = columnas.map(col => `
            <div class="form-check form-check-inline">
                <input type="checkbox" 
                       class="form-check-input" 
                       id="toggle-${col.id}"
                       ${state.columnasVisibles[col.id] ? "checked" : ""}
                       onchange="tableManager.toggleColumnVisibility('${col.id}')">
                <label class="form-check-label" for="toggle-${col.id}">
                    ${col.nombre}
                </label>
            </div>
        `).join("");
    },

    /**
     * Registra un cambio en los datos para posterior guardado
     * @param {string} alumnoId
     * @param {string} campo
     * @param {string} valor
     */
    saveChange: (alumnoId, campo, valor) => {
        state.cambios[alumnoId] = state.cambios[alumnoId] || {};
        state.cambios[alumnoId][campo] = valor;
    }
};

// --------------------------------------------------
// SERVICIO API
// --------------------------------------------------

/**
 * Módulo para comunicación con el backend
 * @type {Object}
 */
const apiService = {
    /**
     * Obtiene los datos de alumnos desde el servidor
     * @async
     * @returns {Promise<void>}
     */
    getAlumnos: async () => {
        elements.table.innerHTML = "";
        elements.load.style.display = "block";

        try {
            const res = await fetch("api/alumnos");
            const { alumnos = [] } = await res.json();

            if (alumnos.length === 0) {
                return elements.table.innerHTML = `
                    <tr>
                        <td colspan="${columnas.length}" style="text-align: center">
                            No se encontraron resultados
                        </td>
                    </tr>
                `;
            }

            alumnos
                .sort((a, b) => a.NOMBRE.localeCompare(b.NOMBRE) ||
                    a.MATRICULA - b.MATRICULA ||
                    a.NUMEROALUMNO - b.NUMEROALUMNO)
                .forEach(alumno => {
                    const row = document.createElement("tr");

                    columnas.forEach(col => {
                        const cell = document.createElement("td");
                        const input = document.createElement("input");

                        input.type = "text";
                        input.className = `form-control form-control-sm ${col.editable ? "" : "no-editable"}`;
                        input.value = alumno[col.id] || "";
                        input.readOnly = !col.editable;
                        input.onchange = () => tableManager.saveChange(alumno.NUMEROALUMNO, col.id, input.value);

                        cell.appendChild(input);
                        cell.dataset.columna = col.id;
                        cell.classList.toggle("hidden-column", !state.columnasVisibles[col.id]);

                        row.appendChild(cell);
                    });

                    elements.table.appendChild(row);
                });
        } catch (error) {
            console.error("Error al cargar alumnos:", error);
            elements.table.innerHTML = `
                <tr>
                    <td colspan="${columnas.length}" style="text-align: center">
                        Error al cargar los datos
                    </td>
                </tr>
            `;
        } finally {
            elements.load.style.display = "none";
        }
    },

    /**
     * Envía los cambios al servidor
     * @async
     * @returns {Promise<void>}
     */
    saveChanges: async () => {
        if (Object.keys(state.cambios).length === 0) {
            return alert("No hay cambios para guardar");
        }

        if (!confirm("¿Está seguro de guardar los cambios?")) {
            return;
        }

        elements.load.style.display = "block";

        try {
            const res = await fetch("api/alumnos/actualizar", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ cambios: state.cambios })
            });

            const data = await res.json();

            if (data.success) {
                alert("Cambios guardados exitosamente");
                state.cambios = {};
            } else {
                alert(`Error: ${data.message || "Error desconocido"}`);
            }
        } catch (error) {
            console.error("Error al guardar cambios:", error);
            alert("Error de conexión con el servidor");
        } finally {
            elements.load.style.display = "none";
        }
    }
};

// --------------------------------------------------
// INICIALIZACIÓN
// --------------------------------------------------

/**
 * Inicializa la aplicación configurando:
 * - Visibilidad de columnas
 * - Propiedad editable de columnas
 * - Event listeners
 */
const init = () => {
    columnas.forEach(col => {
        state.columnasVisibles[col.id] = col.visible;
        col.editable = !["NUMEROALUMNO", "MATRICULA", "MATRICULA_OFICIAL", "NOMBRE"].includes(col.id);
    });

    tableManager.generateColumnToggles();

    apiService.getAlumnos();

    if (elements.saveAllBtn) {
        elements.saveAllBtn.addEventListener("click", apiService.saveChanges);
    }
};

document.addEventListener("DOMContentLoaded", init);