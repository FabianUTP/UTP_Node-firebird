document.addEventListener('DOMContentLoaded', () => {
    // Referencias a elementos del DOM
    const table = document.getElementById("table-container");
    const tableHeader = document.getElementById("table-header");
    const columnToggles = document.getElementById("column-toggles");
    const loadIndicator = document.getElementById("load");
    const saveAllBtn = document.getElementById("save-all-btn");
    const scrollLeftBtn = document.getElementById("scroll-left");
    const scrollRightBtn = document.getElementById("scroll-right");

    // Variables de estado
    let skip = 0;
    let orderBy = "numeroalumno";
    let sort = "asc";
    let cambios = {}; // Objeto para almacenar los cambios
    let columnasVisibles = {}; // Objeto para almacenar la visibilidad de las columnas

    // Definir columnas de la tabla
    const columnas = [
        { id: "numeroalumno", nombre: "Número", visible: true },
        { id: "nombre", nombre: "Nombre", visible: true },
        { id: "matricula", nombre: "Matrícula", visible: true },
        { id: "estadocivil", nombre: "Estado Civil", visible: false },
        { id: "email", nombre: "Email", visible: false },
        { id: "email_alterno", nombre: "Email Alternativo", visible: false },
        { id: "imss", nombre: "IMSS", visible: false },
        { id: "estatus_doctos", nombre: "Estatus TSU", visible: false },
        { id: "fecha_doctos", nombre: "Fecha TSU", visible: false },
        { id: "celular", nombre: "Celular", visible: false },
        { id: "telefono", nombre: "Teléfono", visible: false },
        { id: "proyecto_obs", nombre: "Proyecto Obs", visible: false },
        { id: "obs_proyecto_lic", nombre: "Lic Proyecto Obs", visible: false },
        { id: "tel_contacto", nombre: "Teléfono Contacto", visible: false },
    ];

    // Inicializar el estado de visibilidad de columnas
    columnas.forEach(columna => {
        columnasVisibles[columna.id] = columna.visible;
    });

    // FUNCIONES DE UTILIDAD
    // ---------------------

    // Formatear fecha para el input (MM/DD/YYYY)
    const formatDateToInput = (dateStr) => {
        if (!dateStr) return "";
        const parts = dateStr.split("-");
        if (parts.length !== 3) return "";
        return `${parts[1]}/${parts[2]}/${parts[0]}`;
    };

    // Formatear fecha para la API (YYYY-MM-DD)
    const formatDateToDB = (dateStr) => {
        if (!dateStr) return "";
        const parts = dateStr.split("/");
        if (parts.length !== 3) return "";
        return `${parts[2]}-${parts[0]}-${parts[1]}`;
    };

    // Validar fecha en formato MM/DD/YYYY
    const isValidDate = (dateStr) => {
        if (!dateStr) return true;
        const regex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/;
        return regex.test(dateStr);
    };

    // Mostrar notificaciones al usuario
    const showNotification = (message, type = 'info') => {
        alert(message); // Simplificado para este ejemplo
    };

    // CONTROL DE VISIBILIDAD DE COLUMNAS
    // ---------------------------------

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

    // Cambiar visibilidad de una columna
    const toggleColumnaVisibilidad = (columnaId) => {
        const checkbox = document.getElementById(`toggle-${columnaId}`);
        columnasVisibles[columnaId] = checkbox.checked;

        // Actualizar visibilidad en el encabezado
        const th = document.querySelector(`th[data-columna="${columnaId}"]`);
        if (th) {
            if (checkbox.checked) {
                th.classList.remove("hidden-column");
            } else {
                th.classList.add("hidden-column");
            }
        }

        // Actualizar visibilidad en las celdas
        const celdas = document.querySelectorAll(`td[data-columna="${columnaId}"]`);
        celdas.forEach(celda => {
            if (checkbox.checked) {
                celda.classList.remove("hidden-column");
            } else {
                celda.classList.add("hidden-column");
            }
        });
    };

    // Generar encabezado de la tabla
    const generarEncabezado = () => {
        const tr = document.createElement("tr");

        columnas.forEach(columna => {
            const th = document.createElement("th");
            th.scope = "col";
            th.textContent = columna.nombre;
            th.className = columnasVisibles[columna.id] ? "" : "hidden-column";
            th.dataset.columna = columna.id;

            // Agregar funcionalidad de ordenamiento
            th.style.cursor = "pointer";
            th.addEventListener("click", () => {
                orderBy = columna.id;
                sort = sort === "asc" ? "desc" : "asc";
                getAlumnos();
            });

            tr.appendChild(th);
        });

        tableHeader.innerHTML = "";
        tableHeader.appendChild(tr);
    };

    // Control de desplazamiento horizontal para los toggles
    if (scrollLeftBtn) {
        scrollLeftBtn.addEventListener("click", () => {
            columnToggles.scrollBy({ left: -200, behavior: 'smooth' });
        });
    }

    if (scrollRightBtn) {
        scrollRightBtn.addEventListener("click", () => {
            columnToggles.scrollBy({ left: 200, behavior: 'smooth' });
        });
    }

    // GESTIÓN DE DATOS
    // ---------------

    // Obtener alumnos desde la API
    const getAlumnos = async () => {
        table.innerHTML = "";
        loadIndicator.style.display = "block";

        const url = `api/alumnos?skip=${skip}&orderBy=${orderBy}&sort=${sort}`;

        try {
            const res = await fetch(url);

            if (!res.ok) {
                throw new Error(`Error HTTP: ${res.status}`);
            }

            const { alumnos } = await res.json();

            loadIndicator.style.display = "none";

            if (!alumnos || alumnos.length === 0) {
                table.innerHTML = `<tr><td colspan="${columnas.length}" style="text-align: center;">No se encontraron resultados</td></tr>`;
                return;
            }

            // Generar filas de la tabla
            alumnos.forEach(item => {
                const tr = document.createElement("tr");
                tr.dataset.id = item.NUMEROALUMNO;

                // Crear celda para cada columna definida
                columnas.forEach(columna => {
                    const td = document.createElement("td");
                    td.dataset.columna = columna.id;

                    if (!columnasVisibles[columna.id]) {
                        td.classList.add("hidden-column");
                    }

                    // Según el tipo de columna, crear el contenido apropiado
                    switch (columna.id) {
                        case "numeroalumno":
                            td.textContent = item.NUMEROALUMNO;
                            break;
                        case "nombre":
                            td.textContent = item.NOMBRE;
                            break;
                        case "matricula":
                            td.textContent = item.MATRICULA;
                            break;
                        case "estadocivil":
                            createInputField(td, "text", item.ESTADOCIVIL || "", item.NUMEROALUMNO, "ESTADOCIVIL");
                            break;
                        case "email":
                            createInputField(td, "email", item.EMAIL || "", item.NUMEROALUMNO, "EMAIL");
                            break;
                        case "email_alterno":
                            createInputField(td, "email", item.EMAIL_ALTERNO || "", item.NUMEROALUMNO, "EMAIL_ALTERNO");
                            break;
                        case "imss":
                            createInputField(td, "text", item.NUM_IMSS || "", item.NUMEROALUMNO, "NUM_IMSS");
                            break;
                        case "estatus_doctos":
                            createInputField(td, "text", item.ESTATUS_DOCTOS_TSU || "", item.NUMEROALUMNO, "ESTATUS_DOCTOS_TSU");
                            break;
                        case "fecha_doctos":
                            createDateField(td, formatDateToInput(item.ESTATUS_DOCTOS_TSU_FECHA), item.NUMEROALUMNO, "ESTATUS_DOCTOS_TSU_FECHA");
                            break;
                        case "celular":
                            createInputField(td, "text", item.CELULAR || "", item.NUMEROALUMNO, "CELULAR");
                            break;
                        case "telefono":
                            createInputField(td, "text", item.TELEFONO || "", item.NUMEROALUMNO, "TELEFONO");
                            break;
                        case "proyecto_obs":
                            createInputField(td, "text", item.PROYECTO_OBS || "", item.NUMEROALUMNO, "PROYECTO_OBS");
                            break;
                        case "obs_proyecto_lic":
                            createInputField(td, "text", item.OBS_PROYECTO_LIC || "", item.NUMEROALUMNO, "OBS_PROYECTO_LIC");
                            break;
                        case "tel_contacto":
                            createInputField(td, "text", item.TEL_CONTACTO || "", item.NUMEROALUMNO, "TEL_CONTACTO");
                            break;
                    }

                    tr.appendChild(td);
                });

                table.appendChild(tr);
            });

        } catch (error) {
            console.error("Error al obtener los datos:", error);
            loadIndicator.style.display = "none";
            table.innerHTML = `<tr><td colspan="${columnas.length}" style="text-align: center;">
                Error al cargar los datos: ${error.message}</td></tr>`;
        }
    };

    // Crear un campo de entrada estándar
    const createInputField = (container, type, value, numeroAlumno, fieldName) => {
        const input = document.createElement("input");
        input.type = type;
        input.className = "form-control form-control-sm";
        input.value = value;

        input.addEventListener("change", function () {
            guardarCambio(numeroAlumno, fieldName, this.value);
            // Mostrar feedback visual
            this.classList.add('is-changed');
        });

        container.appendChild(input);
    };

    // Crear un campo de fecha con validación
    const createDateField = (container, value, numeroAlumno, fieldName) => {
        const input = document.createElement("input");
        input.type = "text";
        input.className = "form-control form-control-sm";
        input.value = value;
        input.placeholder = "MM/DD/YYYY";

        input.addEventListener("blur", function () {
            if (this.value && !isValidDate(this.value)) {
                this.classList.add('is-invalid');
                showNotification("Formato de fecha inválido. Use MM/DD/YYYY", "error");
                return;
            }

            this.classList.remove('is-invalid');
            if (this.value) {
                guardarCambio(numeroAlumno, fieldName, formatDateToDB(this.value));
                this.classList.add('is-changed');
            } else {
                guardarCambio(numeroAlumno, fieldName, "");
            }
        });

        container.appendChild(input);
    };

    // GESTIÓN DE CAMBIOS
    // -----------------

    // Guardar cambios en memoria
    const guardarCambio = (numeroAlumno, campo, valor) => {
        if (!cambios[numeroAlumno]) {
            cambios[numeroAlumno] = {};
        }
        cambios[numeroAlumno][campo] = valor;

        // Actualizar el contador de cambios si lo hay
        updateChangesCounter();
    };

    // Actualizar contador de cambios pendientes
    const updateChangesCounter = () => {
        const numChanges = Object.keys(cambios).length;
        const btn = document.getElementById("save-all-btn");

        if (numChanges > 0) {
            btn.textContent = `Guardar Todos los Cambios (${numChanges})`;
            btn.classList.add("btn-warning");
        } else {
            btn.textContent = "Guardar Todos los Cambios";
            btn.classList.remove("btn-warning");
        }
    };

    // Guardar cambios en la API
    const guardarCambios = async (numeroAlumno) => {
        if (!cambios[numeroAlumno] || Object.keys(cambios[numeroAlumno]).length === 0) {
            showNotification("No hay cambios para guardar.", "info");
            return false;
        }

        try {
            const url = `/api/alumnos/${numeroAlumno}/update`;
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(cambios[numeroAlumno]),
            });

            const data = await response.json();

            if (response.ok) {
                showNotification(`Cambios para alumno #${numeroAlumno} guardados correctamente.`, "success");
                delete cambios[numeroAlumno]; // Limpiar cambios
                return true;
            } else {
                showNotification(`Error al guardar los cambios: ${data.message}`, "error");
                return false;
            }
        } catch (error) {
            console.error("Error al guardar los cambios:", error);
            showNotification(`Error al guardar los cambios: ${error.message}`, "error");
            return false;
        }
    };

    // Guardar todos los cambios
    saveAllBtn.addEventListener('click', async () => {
        const numAlumnos = Object.keys(cambios);

        if (numAlumnos.length === 0) {
            showNotification("No hay cambios para guardar.", "info");
            return;
        }

        if (confirm(`¿Deseas guardar los cambios de ${numAlumnos.length} alumno(s)?`)) {
            // Mostrar indicador de carga
            loadIndicator.style.display = "block";
            saveAllBtn.disabled = true;

            let exitos = 0;
            let fallos = 0;

            for (const numeroAlumno of numAlumnos) {
                const resultado = await guardarCambios(numeroAlumno);
                if (resultado) {
                    exitos++;
                } else {
                    fallos++;
                }
            }

            // Ocultar indicador de carga
            loadIndicator.style.display = "none";
            saveAllBtn.disabled = false;

            // Mostrar resumen
            if (fallos === 0) {
                showNotification(`Se guardaron correctamente los cambios de ${exitos} alumno(s).`, "success");
            } else {
                showNotification(`Guardado: ${exitos} éxitos, ${fallos} fallos.`, "warning");
            }

            // Refrescar la tabla
            getAlumnos();
            updateChangesCounter();
        }
    });

    // INICIALIZACIÓN
    // -------------

    // Inicializar componentes
    const inicializar = () => {
        generarColumnToggles();
        generarEncabezado();
        getAlumnos();
    };

    // Iniciar la aplicación
    inicializar();
});