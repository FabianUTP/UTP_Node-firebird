
const table = document.getElementById("table-container");
const tableHeader = document.getElementById("table-header");
const columnToggles = document.getElementById("column-toggles");
const load = document.getElementById("load");
const saveAllBtn = document.getElementById("save-all-btn");

let skip = 0;
let orderBy = "numeroalumno";
let sort = "asc";
let cambios = {}; // Objeto para almacenar los cambios
let columnasVisibles = {}; // Objeto para almacenar la visibilidad de las columnas

// Definir columnas
const columnas = [
    { id: "NUMEROALUMNO", nombre: "NÚMERO", visible: false },
    { id: "NOMBRE", nombre: "NOMBRE", visible: false },
    { id: "PATERNO", nombre: "NOMBRE PATERNO", visible: false },
    { id: "MATERNO", nombre: "NOMBRE MATERNO", visible: false },
    { id: "TIPO_SEG_MED", nombre: "TIPO SEGURO", visible: false },
    { id: "NUM_IMSS", nombre: "NUMERO IMSS", visible: false },
    { id: "NUM_IMSS_VERIFICADOR", nombre: "NUMERO VERIFICACION", visible: false },
    { id: "GENERO", nombre: "GENERO", visible: false },
    { id: "NIVEL", nombre: "NIVEL", visible: false },
    { id: "GRADO", nombre: "GRADO", visible: false },
    { id: "SUBNIVEL", nombre: "SUBNIVEL", visible: false },
    { id: "MATRICULA", nombre: "MATRÍCULA", visible: false },
    { id: "MATRICULA_OFICIAL", nombre: "MATRICULA OFICIAL", visible: false },
    { id: "STATUS", nombre: "STATUS", visible: false },
    { id: "CLAVE_CIUDADANA", nombre: "CLAVE CIUDADANA", visible: false },
    { id: "ESTADO_CIVIL", nombre: "ESTADO CIVIL", visible: false },
    { id: "FECHA_NACIMIENTO", nombre: "FECHA DE NACIMIENTO", visible: false },
    { id: "DOMICILIO", nombre: "DOMICILIO", visible: false },
    { id: "ENTRE_CALLES", nombre: "ENTRE CALLES", visible: false },
    { id: "CP", nombre: "CODIGO POSTAL", visible: false },
    { id: "CIUDAD", nombre: "CIUDAD", visible: false },
    { id: "ESTADO", nombre: "ESTADO", visible: false },
    { id: "LATITUD", nombre: "LATITUD", visible: false },
    { id: "LOGINTUD", nombre: "LOGINTUD", visible: false },
    { id: "TELEFONO", nombre: "TELEFONO", visible: false },
    { id: "CELULAR", nombre: "CELULAR", visible: false },
    { id: "TELEFONOTRABAJO", nombre: "TELEFONOTRABAJO", visible: false },
    { id: "NOMBRETUTOR", nombre: "NOMBRE DEL TUTOR", visible: false },
    { id: "PARENTESCO", nombre: "PARENTESCO", visible: false },
    { id: "OBSERVACIONES", nombre: "OBSERVACIONES", visible: false },
    { id: "ADICIONALES", nombre: "ADICIONALES", visible: false },
    { id: "EMAIL", nombre: "EMAIL PERSONAL", visible: false },
    { id: "EMAIL_ALTERNO", nombre: "EMAIL ALTERNO", visible: false },
    { id: "FECHA_BAJA", nombre: "FECHA DE BAJA", visible: false },
    { id: "ANIOEGRESO", nombre: "AÑO ENGRESO", visible: false },
    { id: "LUGAR_NACIMIENTO", nombre: "LUGAR NACIMIENTO", visible: false },
    { id: "ESTADO_NACIMIENTO", nombre: "ESTADO NACIMIENTO", visible: false },
    { id: "NACIONALIDAD", nombre: "NACIONALIDAD", visible: false },
    { id: "ESCUELA_PROCEDENCIA", nombre: "ESCUELA DE PROCEDENCIA", visible: false },
    { id: "ESCOLARIDAD", nombre: "ESCOLARIDAD", visible: false },
    { id: "ESTADO_ESCOLARIDAD", nombre: "ESTADO ESCOLARIDAD", visible: false },
    { id: "FECHA_EGRESO", nombre: "FECHA EGRESO", visible: false },
    { id: "FECHA_INGRESO", nombre: "FECHA INGRESO", visible: false },
    { id: "FECHA_CREACION", nombre: "FECHA CREACION", visible: false },
    { id: "FECHA_ACTUALIZACION", nombre: "FECHA ACTUALIZACION", visible: false },
    { id: "PROMEDIO_ESC_ANTERIOR", nombre: "PROMEDIO ANTERIOR", visible: false },
    { id: "PROMEDIO_EX_ADMISION", nombre: "PROMEDIO ADMICION", visible: false },
    { id: "CERTIFICADO", nombre: "CERTIFICADO", visible: false },
    { id: "SITUACION_CERTIFICADO", nombre: "SITUACION_CERTIFICADO", visible: false },
    { id: "ALUMNO_ALTAINICIAL", nombre: "ALTA ALUMNO", visible: false },
    { id: "ALUMNO_ALTAFINAL", nombre: "ALTA FINAL", visible: false },
    { id: "ALUMNO_ALTAPERIODO", nombre: "ALTA PERIODO", visible: false },
    { id: "FECHA_PROSPECCION", nombre: "FECHA PROSPECCION", visible: false },
    { id: "PROSPECCION_FINAL", nombre: "PROSPECCION FINAL", visible: false },
    { id: "PROSPECCION_INICIAL", nombre: "PROSPECCION INICIAL", visible: false },
    { id: "PROSPECCION_PERIODO", nombre: "PROSPECCION PERIODO", visible: false },
    { id: "EGRESO_INICIAL", nombre: "ENGRESO INICIAL", visible: false },
    { id: "EGRESO_FINAL", nombre: "ENGRESO FINAL", visible: false },
    { id: "EGRESO_PERIODO", nombre: "ENGRESO PERIODO", visible: false },
    { id: "BECA", nombre: "BECA", visible: false },
    { id: "CUENTA_BECA", nombre: "CUENTA BECA", visible: false },
    { id: "TARJETA_BECA", nombre: "TARGETA BECA", visible: false },
    { id: "PESO_KG", nombre: "PESO", visible: false },
    { id: "CONTACTO", nombre: "CONTACTO", visible: false },
    { id: "PARENTESCO_CONTACTO", nombre: "PARENTESCO DEL CONTACTO", visible: false },
    { id: "TEL_CONTACTO", nombre: "TELEFONO DEL CONTACTO", visible: false },
    { id: "TIPO_SEG_MED", nombre: "TIPO SEGURO MEDICO", visible: false },
    { id: "LENGUAINDIGENA", nombre: "LENJUA INDIGENA", visible: false },
    { id: "DISCAPACIDAD", nombre: "DESCAPACIDAD", visible: false },
    { id: "ENFERNEDAD", nombre: "ENFERMEDAD", visible: false },
    { id: "ALERGIAS", nombre: "ALERGIA", visible: false },
    { id: "NOMBREPADRE", nombre: "NOMBRE DEL PADRE", visible: false },
    { id: "NOMBREMADRE", nombre: "NOMBRE DE LA MADRE", visible: false },
    { id: "PERSONASDEPENDENINGRESO", nombre: "CUANTAS PERSONAS", visible: false },
    { id: "VIVENCASA", nombre: "VIVI EN CASA", visible: false },
    { id: "HERMANOS", nombre: "HERMANOS", visible: false },
    { id: "LUGARNACIMIENTO", nombre: "LUGAR DE NACIMIENTO", visible: false },
    { id: "HERMANOSESTUDIAN", nombre: "HERMANOS ESTUDIAN", visible: false },
    { id: "HORARIOTRABAJAS", nombre: "HORARIOS TRABAJAS", visible: false },
    { id: "ESCOLARIDADCONYUGE", nombre: "ESCOLARIDAD CONYUGE", visible: false },
    { id: "HIJOS0A5", nombre: "HIJOS DE 5", visible: false },
    { id: "HIJOS6A12", nombre: "HIJOS DE 6 A 12", visible: false },
    { id: "HIJOS13A18", nombre: "HIJOS 13 A 18", visible: false },
    { id: "HIJOSMAYORES", nombre: "HIJOS MAYORES", visible: false },
    { id: "CARRERA_ORIGEN_MOV_ACAD", nombre: "CARRERA ORIGEN", visible: false },
    { id: "FOLIO_CENEVAL", nombre: "FOLIO CENEVAL", visible: false },
    { id: "FOLIO_ACTA_EXEN_TSU", nombre: "FOLIO EXEN TSU", visible: false },
    { id: "LIBRO_ACTA_EXEN_TSU", nombre: "LIBRO EXEN TSU", visible: false },
    { id: "FOJAS_ACTA_EXEN_TSU", nombre: "FOJAS EXEN TSU", visible: false },
    { id: "FOLIO_CERTIFICADO_TSU", nombre: "FOLIO CETIFICADO TSU", visible: false },
    { id: "LIBRO_CERTIFICADO_TSU", nombre: "LIBRO CERTIFICADO TSU", visible: false },
    { id: "FOJAS_CERTIFICADO_TSU", nombre: "FOJAS CERTIFICADO TSU", visible: false },
    { id: "FOLIO_TITULACION_TSU", nombre: "FOLIO TITULACION TSU", visible: false },
    { id: "LIBRO_TITULACION_TSU", nombre: "FOLIO TITULACION TSU", visible: false },
    { id: "FOJA_TITULACION_TSU", nombre: "FOLIO TITULACION TSU ", visible: false },
    { id: "FOLIO_TITULACION", nombre: "FOLIO TITULACION TRAMITE", visible: false },
    { id: "FECHA_TRAMITE", nombre: "FECHA DE TRAMITE", visible: false },
    { id: "TITULACION_FOLIOPAGO", nombre: "FOLIO DE PAGO ", visible: false },
    { id: "EMPRESA_NR", nombre: "EMPRESA NR", visible: false },
    { id: "ASESOR_EMPRESARIAL", nombre: "ASESOR EMPRESARIAL", visible: false },
    { id: "ASESOR_EMPRESARIAL_INT", nombre: "ASESOR INT", visible: false },
    { id: "ESTADIA_INICIO", nombre: "ESTADIA INICIO", visible: false },
    { id: "ESTADIA_TERMINO", nombre: "ESTADIA TERMINO", visible: false },
    { id: "FOLIO_CSS", nombre: "FOLIO CSS", visible: false },
    { id: "LIBRO_CSS", nombre: "LIBRO CSS", visible: false },
    { id: "FOJAS_CSS", nombre: "FOJA CSS", visible: false },
    { id: "PROYECTO_NOMBRE", nombre: "NOMBRE DEL PROYECTO", visible: false },
    { id: "CAI_FECHA", nombre: "FECHA CAI", visible: false },
    { id: "ASESOR_ACADEMICO", nombre: "ASESOR ACADEMICO", visible: false },
    { id: "ASESOR_ACAD_EXT", nombre: "ASESOR ACADEMICO EXT", visible: false },
    { id: "PROYECTO_OBS", nombre: "INGLES TSU", visible: false },
    { id: "TRAMITE_COMPLETO", nombre: "TRAMITE COMPLETO", visible: false },
    { id: "FOLIO_CEX", nombre: "FOLIO EXENCION", visible: false },
    { id: "LIBRO_CEX", nombre: "LIBRO EXENCION", visible: false },
    { id: "FOJAS_CEX", nombre: "FOJA EXENCION", visible: false },
    { id: "SOLICITUD_TITULACION_LIC", nombre: "SOLICITUD TRAMITE LIC", visible: false },
    { id: "FOLIO_TITULACION_LIC", nombre: "FOLIO TRAMITE LIC", visible: false },
    { id: "FECHA_TRAMITE_LIC", nombre: "FECHA TRAMITE LIC", visible: false },
    { id: "FOLIO_PAGO_TIT_LIC", nombre: "FOLIO PAGO TIT LIC", visible: false },
    { id: "NUM_CEDULA_TSU", nombre: "NUMERO TSU", visible: false },
    { id: "EMPRESA_ESTADIA_LIC", nombre: "EMPRESA DE ESTADIA", visible: false },
    { id: "ASESOR_EMPRESARIAL_LIC", nombre: "ASESOR EMP LIC", visible: false },
    { id: "FECHA_INICIO_EST_LIC", nombre: "FECHA INICIO EST LIC", visible: false },
    { id: "FECHA_FIN_EST_LIC", nombre: "FECHA TERMINO EST LIC", visible: false },
    { id: "FECHA_LIBERACION_EST_LIC", nombre: "FECHA LIB EST LIC ", visible: false },
    { id: "PROYECTO_EST_LIC", nombre: "PROYECTO EST LIC", visible: false },
    { id: "FECHA_AUTORIZACION_LIC", nombre: "FECHA AUTORIZ", visible: false },
    { id: "ASESOR_ACAD_LIC", nombre: "ASESOR ACAD LIC", visible: false },
    { id: "OBS_PROYECTO_LIC", nombre: "NIVEL INGLES LIC", visible: false },
    { id: "FECHA_INGRESO_LIC", nombre: "FECHA INGRESO LIC", visible: false },
    { id: "FECHA_EGRESO_LIC", nombre: "FECHA ENGRESO LIC", visible: false },
    { id: "INICIO_BACH", nombre: "INICIO BACHILLERATO", visible: false },
    { id: "FIN_BACH", nombre: "FIN BACHILLERATO", visible: false },
    { id: "FOLIO_CERLIC", nombre: "FOLIO CERLIC", visible: false },
    { id: "LIBRO_CERLIC", nombre: "LIBRO CERLIC", visible: false },
    { id: "FOJA_CERLIC", nombre: "FOJA CERLIC", visible: false },
    { id: "FOLIO_CSSLIC", nombre: "FOLIO CSSLIC", visible: false },
    { id: "LIBRO_CSSLIC", nombre: "LIBRO CSSLIC", visible: false },
    { id: "FOJA_CSSLIC", nombre: "FOJA CSSLIC", visible: false },
    { id: "FOLIO_TITLIC", nombre: "FOLIO TITLIC", visible: false },
    { id: "LIBRO_TITLIC", nombre: "LIBRO TITLIC", visible: false },
    { id: "FOJA_TITLIC", nombre: "FOJA TICLIC", visible: false },
    { id: "ALUMNO_PASSWORD", nombre: "ALUMNO_PASSWORD", visible: false },
    { id: "NUM_CEDULA_LIC", nombre: "NUMERO CEDULA LIC", visible: false },
    { id: "ESTADOCIVIL", nombre: "PRUEBA", visible: false },
];

// Función para alternar la visibilidad de las columnas
const toggleColumnaVisibilidad = (columnId) => {
    columnasVisibles[columnId] = !columnasVisibles[columnId];
    renderTable();
};

// Función para generar la tabla con base en la visibilidad de las columnas
const renderTable = () => {
    let headerRow = "<tr>";
    columnas.forEach(col => {
        if (columnasVisibles[col.id]) {
            headerRow += `<th>${col.nombre}</th>`;
        }
    });
    headerRow += "</tr>";

    tableHeader.innerHTML = headerRow;

    // Actualizar visibilidad de las celdas
    const rows = table.querySelectorAll("tr");
    rows.forEach(row => {
        const cells = row.querySelectorAll("td");
        cells.forEach(cell => {
            const columnaId = cell.dataset.columna;
            if (columnasVisibles[columnaId]) {
                cell.classList.remove("hidden-column");
            } else {
                cell.classList.add("hidden-column");
            }
        });
    });
};

// Formatear fecha para el input (MM/DD/YYYY)
const formatDateToInput = (dateStr) => {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split("-");
    return `${month}/${day}/${year}`;
};

// Formatear fecha para la API (YYYY-MM-DD)
const formatDateToDB = (dateStr) => {
    if (!dateStr) return "";
    const [month, day, year] = dateStr.split("/");
    return `${year}-${month}-${day}`;
};

// Generar checkboxes para controlar la visibilidad de las columnas
const generarColumnToggles = () => {
    columnToggles.innerHTML = "";

    columnas.forEach(columna => {
        const checkboxContainer = document.createElement("div");
        checkboxContainer.className = "form-check form-check-inline";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.className = "form-check-input";
        checkbox.id = `toggle-${columna.id}`;
        checkbox.checked = columnasVisibles[columna.id];
        checkbox.addEventListener("change", () => {
            toggleColumnaVisibilidad(columna.id);
        });

        const label = document.createElement("label");
        label.className = "form-check-label";
        label.htmlFor = `toggle-${columna.id}`;
        label.textContent = columna.nombre;

        checkboxContainer.appendChild(checkbox);
        checkboxContainer.appendChild(label);
        columnToggles.appendChild(checkboxContainer);
    });
};

// Función para guardar cambios
const guardarCambio = (alumnoId, campo, valor) => {
    cambios[alumnoId] = cambios[alumnoId] || {};
    cambios[alumnoId][campo] = valor;
    console.log("Cambios guardados:", cambios);
};

// Obtener alumnos desde la API
const getAlumnos = async () => {
    while (table.firstChild) {
        table.removeChild(table.firstChild);
    }
    load.style.display = "block";

    const url = `api/alumnos`;

    try {
        const res = await fetch(url);
        const data = await res.json();
        let alumnos = data.alumnos || [];

        load.style.display = "none";

        if (alumnos.length === 0) {
            const tr = document.createElement("tr");
            const td = document.createElement("td");
            td.colSpan = columnas.length;
            td.style.textAlign = "center";
            td.textContent = "No se encontraron resultados";
            tr.appendChild(td);
            table.appendChild(tr);
            return;
        }

        // Ordenar alumnos: primero por nombre (A-Z), luego por matrícula (0-9000), y finalmente por número (0-9000)
        alumnos.sort((a, b) => {
            let cmp = a.NOMBRE.localeCompare(b.NOMBRE, "es", { sensitivity: "base" });
            if (cmp !== 0) return cmp;
            cmp = Number(a.MATRICULA) - Number(b.MATRICULA);
            if (cmp !== 0) return cmp;
            return Number(a.NUMEROALUMNO) - Number(b.NUMEROALUMNO);
        });

        // Generar filas de la tabla
        alumnos.forEach(item => {
            const tr = document.createElement("tr");

            columnas.forEach(columna => {
                const td = document.createElement("td");
                const input = document.createElement("input");
                input.type = "text";
                input.className = "form-control form-control-sm";
                input.value = item[columna.id.toUpperCase()] || "";
                input.onchange = () => {
                    guardarCambio(item.NUMEROALUMNO, columna.id.toUpperCase(), input.value);
                };
                td.appendChild(input);
                td.dataset.columna = columna.id;

                if (!columnasVisibles[columna.id]) {
                    td.classList.add("hidden-column");
                }

                tr.appendChild(td);
            });

            table.appendChild(tr);
        });
    } catch (error) {
        console.error("Error al obtener los datos:", error);
        load.style.display = "none";
        const tr = document.createElement("tr");
        const td = document.createElement("td");
        td.colSpan = columnas.length;
        td.style.textAlign = "center";
        td.textContent = "Error al cargar los datos";
        tr.appendChild(td);
        table.appendChild(tr);
    }
};



document.addEventListener('DOMContentLoaded', function() {
    const loadingElement = document.getElementById('load');
    loadingElement.classList.remove('d-none');
    
    // Si quieres que se oculte automáticamente después de cargar los datos
    // asegúrate de que en tu función getAlumnos() se incluya:
    // loadingElement.classList.add('d-none');
});

// Modificación a la función getAlumnos (asumiendo que está en algún archivo JS importado)
const originalGetAlumnos = window.getAlumnos;
if (typeof originalGetAlumnos === 'function') {
    window.getAlumnos = async function() {
        const loadingElement = document.getElementById('load');
        loadingElement.classList.remove('d-none');
        
        try {
            await originalGetAlumnos();
        } finally {
            // Ocultar el spinner cuando termine la carga (con éxito o error)
            loadingElement.classList.add('d-none');
        }
    };
}

// Inicializar componentes
const inicializar = () => {
    // Inicializar visibilidad de columnas
    columnas.forEach(columna => {
        columnasVisibles[columna.id] = columna.visible;
    });

    generarColumnToggles();
    getAlumnos();
};

// Iniciar la aplicación
inicializar();
