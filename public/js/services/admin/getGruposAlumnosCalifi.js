"use strict";

const loaderTable = document.getElementById("loader");
const table = document.getElementById("table-container");
const idGrupo = document.getElementById("idGrupo");
const asignaturaList = document.getElementById("asignatura-list");
const evalSelect = document.getElementById("eval-select");
const claveProfesorSpan = document.getElementById("claveProfesor");
const updateAllBtn = document.getElementById("update-all-btn");

const formCalif = document.getElementById("formCalif");
const fileExcel = document.getElementById("input");

let limit = 500, skip = 0, alumnosData = [], selectedAsignatura = null, selectedEval = 'A';

// Función para obtener los alumnos
const getAlumnos = async () => {
  loaderTable.style.display = "block";
  try {
    const res = await fetch(`/api/gruposcalifi_alumnos/${idGrupo.value}?limit=${limit}&skip=${skip}`);
    const { alumnos } = await res.json();

    if (!alumnos || alumnos.length === 0) {
      return; // No hacer nada si no hay alumnos
    }

    alumnosData = alumnos;
    loaderTable.style.display = "none";
    llenarAsignaturas(alumnos);
    llenarEvaluaciones(alumnos);
    mostrarAlumnos();
  } catch (error) {
    loaderTable.style.display = "none";
  }
};

// Función para llenar la lista de asignaturas
const llenarAsignaturas = (alumnos) => {
  const asignaturas = new Map(alumnos.map(alumno => [alumno.CLAVEASIGNATURA, alumno.NOMBREASIGNATURA]));
  asignaturaList.innerHTML = '';  // Limpiar la lista de asignaturas

  if (asignaturas.size === 0) {
    return; // Si no hay asignaturas, no hacer nada
  }

  asignaturas.forEach((nombre, clave) => {
    const listItem = document.createElement('li');
    listItem.className = 'asignatura-item';
    listItem.dataset.clave = clave;
    listItem.textContent = nombre;
    asignaturaList.appendChild(listItem);
  });

  asignaturaList.addEventListener('click', (event) => {
    if (event.target.matches('li.asignatura-item')) {
      selectedAsignatura = event.target.dataset.clave;
      actualizarClaveProfesor();
      mostrarAlumnos();
      document.querySelectorAll('.asignatura-item').forEach(item => item.classList.remove('selected'));
      event.target.classList.add('selected');
    }
  });

  if (selectedAsignatura) {
    const selectedItem = document.querySelector(`li[data-clave="${selectedAsignatura}"]`);
    if (selectedItem) selectedItem.classList.add('selected');
  }
};

// Función para llenar las evaluaciones
const llenarEvaluaciones = (alumnos) => {
  const evaluaciones = new Map(alumnos.map(alumno => [alumno.ID_EVAL, alumno.NOMBRE_EVAL]));
  evalSelect.innerHTML = '<option value="">Seleccione una evaluación</option>';
  evaluaciones.forEach((nombre, id) => {
    const option = document.createElement('option');
    option.value = id;
    option.textContent = nombre;
    evalSelect.appendChild(option);
  });
  evalSelect.value = selectedEval;
  evalSelect.addEventListener('change', () => {
    selectedEval = evalSelect.value;
    mostrarAlumnos();
  });
};

// Función para actualizar el nombre del profesor
const actualizarClaveProfesor = () => {
  const profesor = alumnosData.find(alumno => alumno.CLAVEASIGNATURA === selectedAsignatura);
  claveProfesorSpan.textContent = profesor ? `Profesor: ${profesor.NOMBREPROFESOR}` : '';
};

// Función para mostrar los alumnos en la tabla
const mostrarAlumnos = () => {
  if (!selectedAsignatura || !selectedEval) {
    table.innerHTML = "";
    return;
  }

  let content = "", seen = new Set(), counter = skip + 1;
  const alumnosFiltrados = alumnosData.filter(alumno => alumno.CLAVEASIGNATURA === selectedAsignatura && alumno.ID_EVAL === selectedEval);
  alumnosFiltrados.forEach(item => {
    const uniqueKey = `${item.NUMEROALUMNO}-${item.ID_PLAN}-${item.CLAVEASIGNATURA}-${item.ID_EVAL}`;
    if (seen.has(uniqueKey)) return;
    seen.add(uniqueKey);
    
    content += `<tr style="text-align: right;" data-numeroalumno="${item.NUMEROALUMNO}" data-claveasignatura="${item.CLAVEASIGNATURA}" data-id_eval="${item.ID_EVAL}" data-inicial="${item.INICIAL}" data-final="${item.FINAL}" data-periodo="${item.PERIODO}">
      <td style="text-align: center; width: 5%;">${counter}</td>
      <td style="text-align: left; width: 30%;">${item.PATERNO} ${item.MATERNO} ${item.NOMBRE}</td>
      <td style="text-align: left; width: 20%;">${item.MATRICULA}</td>
      <td style="text-align: center; width: 15%;"><input style="text-align: center; font-size: 14px;" class="calificacion-input" value="${item.CALIFICACION}" size="1"></td>
      <td style="text-align: center; width: 20%;"><button class="save-btn" onclick="guardarCalificacion(${item.NUMEROALUMNO})" style="background-color: #911820; color: white; padding: 5px 10px; border: none; border-radius: 5px; font-size: 12px;">Guardar</button></td>
    </tr>`;
    counter++;
  });
  table.innerHTML = content;
};

// Función para guardar la calificación de un alumno
const guardarCalificacion = async (numeroalumno) => {
  const row = document.querySelector(`tr[data-numeroalumno="${numeroalumno}"]`);
  if (!row) return;

  const { claveasignatura, id_eval, inicial, final, periodo } = row.dataset;
  const calificacion = parseFloat(row.querySelector('.calificacion-input').value);

  try {
    await actualizarAlumno({ numeroalumno, claveasignatura, id_eval, inicial, final, periodo, calificacion });
    row.querySelector('.calificacion-input').value = calificacion;
  } catch (error) {
    console.error("Error al actualizar la calificación", error);
  }
};

// Función para actualizar los datos del alumno
const actualizarAlumno = async (alumno) => {
  const res = await fetch(`/api/gruposcalifi_alumnos/${idGrupo.value}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(alumno)
  });
  if (!res.ok) return;
};

// Función para actualizar todas las calificaciones
const actualizarTodasCalificaciones = async () => {
  const updates = Array.from(table.querySelectorAll('tr')).map(row => {
    const { numeroalumno, claveasignatura, id_eval, inicial, final, periodo } = row.dataset;
    const calificacion = parseFloat(row.querySelector('.calificacion-input').value);
    if (isNaN(calificacion)) return null;
    return { numeroalumno, claveasignatura, id_eval, inicial, final, periodo, calificacion };
  }).filter(alumno => alumno !== null);

  // Llamamos a la misma API para actualizar los alumnos uno por uno
  for (const alumno of updates) {
    try {
      await actualizarAlumno(alumno); // Usando la misma función
    } catch (error) {
      console.error("Error al actualizar el alumno:", alumno.numeroalumno, error);
    }
  }

  getAlumnos(); // Recargar los alumnos
};

// Se generar EXEL

document.getElementById("input").addEventListener("change", async (event) => {
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

  excelData.slice(8).forEach((row) => {
      const [, nombre, matricula, nuevaCalificacion] = row; 

      tablaRows.forEach((tr) => {
          const tds = tr.getElementsByTagName("td");
          if (tds.length >= 3) {
              const nombreTabla = tds[1].textContent.trim();
              const matriculaTabla = tds[2].textContent.trim();
              const inputCalificacion = tr.querySelector(".calificacion-input");

              if (nombreTabla === nombre && matriculaTabla === matricula) {
                  const calificacionActual = inputCalificacion.value.trim();

                  if (calificacionActual !== nuevaCalificacion) {
                      inputCalificacion.style.backgroundColor = "#ffeb3b"; 
                      inputCalificacion.dataset.nuevaCalificacion = nuevaCalificacion; 
                  }
              }
          }
      });
  });
};

// Guardar las calificaciones modificadas
// Guardar las calificaciones modificadas
document.getElementById("guardarCalifBtn").addEventListener("click", async () => {
  const guardarBtn = document.getElementById("guardarCalifBtn");

  // Deshabilitar el botón y cambiar el texto mientras se guarda
  guardarBtn.disabled = true;
  const originalText = guardarBtn.textContent;
  guardarBtn.textContent = "Espere un momento...";

  const tablaRows = document.querySelectorAll("#table-container tr");

  for (const tr of tablaRows) {
      const inputCalificacion = tr.querySelector(".calificacion-input");

      if (inputCalificacion && inputCalificacion.dataset.nuevaCalificacion) {
          inputCalificacion.value = parseFloat(inputCalificacion.dataset.nuevaCalificacion).toFixed(1);  // Asegurar que tenga un decimal
          inputCalificacion.style.backgroundColor = "#73b43e"; // Cambiar el color al indicado
          delete inputCalificacion.dataset.nuevaCalificacion;

          const numeroAlumno = tr.dataset.numeroalumno;
          await guardarCalificacion(numeroAlumno);
      }
  }

  // Restaurar el botón
  guardarBtn.textContent = originalText;
  guardarBtn.disabled = false;

  // Recargar la página después de actualizar las calificaciones
  window.location.reload();
});

// Cargar los alumnos iniciales
getAlumnos();
