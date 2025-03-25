"use strict";

// Elementos del DOM
const loaderTable = document.getElementById("loader");
const table = document.getElementById("table-container");
const idGrupo = document.getElementById("idGrupo");
const asignaturaList = document.getElementById("asignatura-list");
const evalSelect = document.getElementById("eval-select");
const claveProfesorSpan = document.getElementById("claveProfesor");
const updateAllBtn = document.getElementById("update-all-btn");
const fileExcel = document.getElementById("input");
const guardarCalifBtn = document.getElementById("guardarCalifBtn");

let limit = 500, skip = 0, alumnosData = [], selectedAsignatura = null, selectedEval = 'A';

// Función para obtener los alumnos
const getAlumnos = async () => {
    loaderTable.style.display = "block";
    try {
        const res = await fetch(`/api/gruposcalifi_alumnos/${idGrupo.value}?limit=${limit}&skip=${skip}`);
        const { alumnos } = await res.json();

        if (!alumnos || alumnos.length === 0) return;

        alumnosData = alumnos;
        llenarAsignaturas();
        llenarEvaluaciones();
        mostrarAlumnos();
    } catch (error) {
        console.error("Error al obtener alumnos:", error);
    } finally {
        loaderTable.style.display = "none";
    }
};

// Llenar lista de asignaturas
const llenarAsignaturas = () => {
    asignaturaList.innerHTML = '';
    const asignaturas = new Map(alumnosData.map(({ CLAVEASIGNATURA, NOMBREASIGNATURA }) => [CLAVEASIGNATURA, NOMBREASIGNATURA]));

    if (asignaturas.size === 0) return;

    asignaturas.forEach((nombre, clave) => {
        const listItem = document.createElement('li');
        listItem.className = 'asignatura-item';
        listItem.dataset.clave = clave;
        listItem.textContent = nombre;
        asignaturaList.appendChild(listItem);
    });
};

// Evento delegado para seleccionar asignatura
asignaturaList.addEventListener('click', (event) => {
    if (!event.target.matches('.asignatura-item')) return;

    document.querySelectorAll('.asignatura-item').forEach(item => item.classList.remove('selected'));
    event.target.classList.add('selected');

    selectedAsignatura = event.target.dataset.clave;
    actualizarClaveProfesor();
    mostrarAlumnos();
});

// Llenar lista de evaluaciones
const llenarEvaluaciones = () => {
    evalSelect.innerHTML = '<option value="">Seleccione una evaluación</option>';
    const evaluaciones = new Map(alumnosData.map(({ ID_EVAL, NOMBRE_EVAL }) => [ID_EVAL, NOMBRE_EVAL]));

    evaluaciones.forEach((nombre, id) => {
        const option = document.createElement('option');
        option.value = id;
        option.textContent = nombre;
        evalSelect.appendChild(option);
    });

    evalSelect.value = selectedEval;
};

// Evento de cambio en evaluación
evalSelect.addEventListener('change', () => {
    selectedEval = evalSelect.value;
    mostrarAlumnos();
});

// Actualizar nombre del profesor
const actualizarClaveProfesor = () => {
    const profesor = alumnosData.find(({ CLAVEASIGNATURA }) => CLAVEASIGNATURA === selectedAsignatura);
    claveProfesorSpan.textContent = profesor ? `Profesor: ${profesor.NOMBREPROFESOR}` : '';
};

// Mostrar alumnos en la tabla
const mostrarAlumnos = () => {
    if (!selectedAsignatura || !selectedEval) {
        table.innerHTML = "";
        return;
    }

    let content = "";
    const seen = new Set();
    let counter = skip + 1;

    const alumnosFiltrados = alumnosData.filter(({ CLAVEASIGNATURA, ID_EVAL }) =>
        CLAVEASIGNATURA === selectedAsignatura && ID_EVAL === selectedEval
    );

    alumnosFiltrados.forEach(item => {
        const uniqueKey = `${item.NUMEROALUMNO}-${item.ID_PLAN}-${item.CLAVEASIGNATURA}-${item.ID_EVAL}`;
        if (seen.has(uniqueKey)) return;
        seen.add(uniqueKey);

        content += `
        <tr data-numeroalumno="${item.NUMEROALUMNO}" data-claveasignatura="${item.CLAVEASIGNATURA}" data-id_eval="${item.ID_EVAL}">
            <td>${counter++}</td>
            <td>${item.PATERNO} ${item.MATERNO} ${item.NOMBRE}</td>
            <td>${item.MATRICULA}</td>
            <td><input class="calificacion-input" value="${item.CALIFICACION}" size="1"></td>
            <td><button class="save-btn" onclick="guardarCalificacion(${item.NUMEROALUMNO})">Guardar</button></td>
        </tr>`;
    });

    table.innerHTML = content;
};

// Guardar calificación de un alumno
const guardarCalificacion = async (numeroalumno) => {
    const row = document.querySelector(`tr[data-numeroalumno="${numeroalumno}"]`);
    if (!row) return;

    const { claveasignatura, id_eval } = row.dataset;
    const calificacion = parseFloat(row.querySelector('.calificacion-input').value);

    try {
        await actualizarAlumno({ numeroalumno, claveasignatura, id_eval, calificacion });
    } catch (error) {
        console.error("Error al actualizar la calificación", error);
    }
};

// Actualizar alumno en la API
const actualizarAlumno = async (alumno) => {
    try {
        await fetch(`/api/gruposcalifi_alumnos/${idGrupo.value}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(alumno)
        });
    } catch (error) {
        console.error("Error en actualización:", error);
    }
};

// Actualizar todas las calificaciones
const actualizarTodasCalificaciones = async () => {
    const updates = Array.from(table.querySelectorAll('tr')).map(row => {
        const { numeroalumno, claveasignatura, id_eval } = row.dataset;
        const calificacion = parseFloat(row.querySelector('.calificacion-input').value);
        return isNaN(calificacion) ? null : { numeroalumno, claveasignatura, id_eval, calificacion };
    }).filter(Boolean);

    for (const alumno of updates) {
        await actualizarAlumno(alumno);
    }

    getAlumnos();
};

// Procesar archivo Excel
fileExcel.addEventListener("change", async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsArrayBuffer(file);

    reader.onload = async (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const excelData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        procesarExcel(excelData);
    };
});

const procesarExcel = (excelData) => {
    const tablaRows = document.querySelectorAll("#table-container tr");

    excelData.slice(8).forEach(([ , nombre, matricula, nuevaCalificacion]) => {
        tablaRows.forEach(tr => {
            const [ , nombreTabla, matriculaTabla] = tr.getElementsByTagName("td");
            const inputCalificacion = tr.querySelector(".calificacion-input");

            if (nombreTabla.textContent.trim() === nombre && matriculaTabla.textContent.trim() === matricula) {
                if (inputCalificacion.value.trim() !== nuevaCalificacion) {
                    inputCalificacion.style.backgroundColor = "#ffeb3b";
                    inputCalificacion.dataset.nuevaCalificacion = nuevaCalificacion;
                }
            }
        });
    });
};

// Guardar calificaciones del Excel
guardarCalifBtn.addEventListener("click", async () => {
    guardarCalifBtn.disabled = true;
    guardarCalifBtn.textContent = "Espere...";

    document.querySelectorAll(".calificacion-input[data-nuevaCalificacion]").forEach(async (input) => {
        input.value = input.dataset.nuevaCalificacion;
        delete input.dataset.nuevaCalificacion;
        input.style.backgroundColor = "#73b43e";

        await guardarCalificacion(input.closest("tr").dataset.numeroalumno);
    });

    guardarCalifBtn.textContent = "Guardar Calificaciones";
    guardarCalifBtn.disabled = false;
    getAlumnos();
});

// Cargar alumnos
getAlumnos();
