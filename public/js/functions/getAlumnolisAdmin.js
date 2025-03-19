
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
    { id: "numeroalumno", nombre: "Número", visible: false },
    { id: "nombre", nombre: "Nombre", visible: false },
    { id: "matricula", nombre: "Matrícula", visible: false },
    { id: "estadocivil", nombre: "Estado Civil", visible: false },
    { id: "email", nombre: "EMAIL", visible: false },
    { id: "email_alterno", nombre: "EMAIL ALTER", visible: false },
    { id: "num_imss", nombre: "NUMERO DE IMSS", visible: false },
    { id: "num_imss_verificador", nombre: "NUMERO VERIFICADOR IMSS", visible: false },
    { id: "celular", nombre: "CELULAR", visible: false },
    { id: "telefono", nombre: "TELEFONO", visible: false },
    { id: "proyecto_obs", nombre: "PROYECTO OBS", visible: false },
    { id: "obs_proyecto_lic", nombre: "LIC PROYECTO OBS ", visible: false },
    { id: "tel_contacto", nombre: "TELEFONO CONTACTO", visible: false },
    { id: "tipo_seg_med", nombre: "TIPO DE SEG MEDICO", visible: false },
    { id: "lenguaindigena", nombre: "LENGUA INDIGENA", visible: false },
    { id: "DISCAPACIDAD", nombre: "DISCAPACIDADES", visible: false },
    { id: "ENFERNEDAD", nombre: "ENFERNEDAD", visible: false },
    { id: "alergias", nombre: "ALERGIAS", visible: false },
    { id: "escolaridadpadre", nombre: "ESCOLARIDAD PADRE", visible: false },
    { id: "actividadpadre", nombre: "ACTIVIDAD PADRE", visible: false },
    { id: "actividadmadre", nombre: "ACTIVIDAD MADRE", visible: false },
    { id: "AUTOMOVILFAMILIAR", nombre: "AUTOMOVIL FAMILIAR", visible: false },
    { id: "COMPUTADORA", nombre: "COMPUTADORA", visible: false },
    { id: "tamanocasa", nombre: "TAMAÑO CASA", visible: false },
    { id: "INFRESOFAMILIAR", nombre: "INFRESO FAMILIAR", visible: false },
    { id: "personasdependeningreso", nombre: "PERSONASDEPENDENINGRESO", visible: false },
    { id: "VIVENENCASA", nombre: "VIVENENCASA", visible: false },
    { id: "HERMANOS", nombre: "HERMANOS", visible: false },
    { id: "LUGARNACIMIENTO", nombre: "LUGARNACIMIENTO", visible: false },
    { id: "HERMANOSESTUDIAN", nombre: "HERMANOSESTUDIAN", visible: false },
    { id: "TRABAJAS", nombre: "TRABAJAS", visible: false },
    { id: "ACTIVIDADTRABAJAS", nombre: "ACTIVIDADTRABAJAS", visible: false },
    { id: "NOMBRECONYUGE", nombre: "NOMBRECONYUGE", visible: false },
    { id: "ESCOLARIDADCONYUGE", nombre: "ESCOLARIDADCONYUGE", visible: false },
    { id: "ACTIVIDADCONYUGE", nombre: "ACTIVIDADCONYUGE", visible: false },
    { id: "NIVELCOMPLETO", nombre: "NIVELCOMPLETO", visible: false },
    { id: "HIJOS0A5", nombre: "HIJOS", visible: false },
    { id: "INICIO_EGRESO", nombre: "INICIO_EGRESO", visible: false },
    { id: "FOLIO_TITULACION", nombre: "FOLIO_TITULACION", visible: false },
    { id: "FECHA_TRAMITE", nombre: "FECHA_TRAMITE", visible: false },
    { id: "TITULACION_AN", nombre: "TITULACION AN", visible: false },
    { id: "TITULACION_CB", nombre: "TITULACION CB", visible: false },
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
        const alumnos = data.alumnos || [];

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
