const table = document.getElementById("table-container");
const tableHeader = document.getElementById("table-header");
const columnToggles = document.getElementById("column-toggles");
const load = document.getElementById("load");
const saveAllBtn = document.getElementById("save-all-btn");

let skip = 0;
let orderBy = "numeroalumno";
let sort = "asc";
let cambios = {};
let columnasVisibles = {};

const columnas = [
    { id: "NUMEROALUMNO", nombre: "NUMEROALUMNO", visible: false },
    { id: "MATRICULA", nombre: "MATRICULA", visible: false },
    { id: "MATRICULA_OFICIAL", nombre: "MATRICULA_OFICIAL", visible: false },
    { id: "NOMBRE", nombre: "NOMBRE", visible: false },
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
    { id: "LIBRO_TITLIC", nombre: "LIBRO TITLIC", visible: false },
    { id: "FOJA_TITLIC", nombre: "FOJA_TITLIC", visible: false },
    { id: "ALUMNO_PASSWORD", nombre: "ALUMNO_PASSWORD", visible: false },
    { id: "NUM_CEDULA_LIC", nombre: "NUM_CEDULA_LIC", visible: false },
    { id: "ESTADOCIVIL", nombre: "ESTADOCIVIL", visible: false },
];

const toggleColumnaVisibilidad = (columnId) => {
    columnasVisibles[columnId] = !columnasVisibles[columnId];
    renderTable();
};

const renderTable = () => {
    let headerRow = "<tr>";
    columnas.forEach(col => {
        if (columnasVisibles[col.id]) {
            headerRow += `<th>${col.nombre}</th>`;
        }
    });
    headerRow += "</tr>";

    tableHeader.innerHTML = headerRow;

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

const formatDateToInput = (dateStr) => {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split("-");
    return `${month}/${day}/${year}`;
};

const formatDateToDB = (dateStr) => {
    if (!dateStr) return "";
    const [month, day, year] = dateStr.split("/");
    return `${year}-${month}-${day}`;
};

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

        alumnos.sort((a, b) => {
            let cmp = a.NOMBRE.localeCompare(b.NOMBRE, "es", { sensitivity: "base" });
            if (cmp !== 0) return cmp;
            cmp = Number(a.MATRICULA) - Number(b.MATRICULA);
            if (cmp !== 0) return cmp;
            return Number(a.NUMEROALUMNO) - Number(b.NUMEROALUMNO);
        });

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

document.addEventListener('DOMContentLoaded', function () {
    const loadingElement = document.getElementById('load');
    loadingElement.classList.remove('d-none');
});

const originalGetAlumnos = window.getAlumnos;
if (typeof originalGetAlumnos === 'function') {
    window.getAlumnos = async function () {
        const loadingElement = document.getElementById('load');
        loadingElement.classList.remove('d-none');

        try {
            await originalGetAlumnos();
        } finally {
            loadingElement.classList.add('d-none');
        }
    };
}

const inicializar = () => {
    columnas.forEach(columna => {
        columnasVisibles[columna.id] = columna.visible;
    });

    generarColumnToggles();
    getAlumnos();
};

inicializar();