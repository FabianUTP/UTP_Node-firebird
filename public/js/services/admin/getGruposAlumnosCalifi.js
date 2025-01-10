"use strict";

const loader_table = document.getElementById("loader");
const table = document.getElementById("table-container");
const idGrupo = document.getElementById("idGrupo");
const asignaturaList = document.getElementById("asignatura-list");
const evalSelect = document.getElementById("eval-select");
const claveProfesorSpan = document.getElementById("claveProfesor");
const updateAllBtn = document.getElementById("update-all-btn");
const updateDateBtn = document.getElementById("update-date-btn");

let limit = 500000;
let skip = 0;
let alumnosLength = 0;
let alumnosData = [];
let selectedAsignatura = null;
let selectedEval = 'A'; 

// Función para formatear la fecha en yyyy-MM-dd
const formatFecha = (fecha) => {
  if (!fecha) return '';
  const date = new Date(fecha);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};


const getAlumnos = async () => {
  loader_table.style.display = "block";

  const url = `/api/gruposcalifi_alumnos/${idGrupo.value}?limit=${limit}&skip=${skip}`;
  const res = await fetch(url);
  const { alumnos } = await res.json();
  alumnosData = alumnos;

  loader_table.style.display = "none";

  llenarAsignaturas(alumnos);
  llenarEvaluaciones(alumnos);
  mostrarAlumnos(); 
};

const llenarAsignaturas = (alumnos) => {
  const asignaturas = new Map();

  alumnos.forEach(alumno => {
    asignaturas.set(alumno.CLAVEASIGNATURA, alumno.NOMBREASIGNATURA);
  });

  asignaturaList.innerHTML = '';

  asignaturas.forEach((nombreAsignatura, claveAsignatura) => {
    const listItem = document.createElement('li');
    listItem.className = 'asignatura-item';
    listItem.dataset.clave = claveAsignatura;
    listItem.textContent = `${nombreAsignatura}`;
    asignaturaList.appendChild(listItem);
  });

  asignaturaList.addEventListener('click', (event) => {
    if (event.target && event.target.matches('li.asignatura-item')) {
      selectedAsignatura = event.target.dataset.clave;
      actualizarClaveProfesor();
      mostrarAlumnos();
      document.querySelectorAll('.asignatura-item').forEach(item => item.classList.remove('selected'));
      event.target.classList.add('selected');
    }
  });


  if (selectedAsignatura) {
    const selectedItem = document.querySelector(`li[data-clave="${selectedAsignatura}"]`);
    if (selectedItem) {
      selectedItem.classList.add('selected');
    }
  }
};

const llenarEvaluaciones = (alumnos) => {
  const evaluaciones = new Map();

  alumnos.forEach(alumno => {
    evaluaciones.set(alumno.ID_EVAL, alumno.NOMBRE_EVAL);
  });

  evalSelect.innerHTML = '<option value="">Seleccione una evaluación</option>';

  evaluaciones.forEach((nombreEval, idEval) => {
    const option = document.createElement('option');
    option.value = idEval;
    option.textContent = nombreEval; 
    evalSelect.appendChild(option);
  });

  evalSelect.value = selectedEval;
  
  evalSelect.addEventListener('change', () => {
    selectedEval = evalSelect.value;
    mostrarAlumnos();
  });
};

const actualizarClaveProfesor = () => {
  const profesor = alumnosData.find(alumno => alumno.CLAVEASIGNATURA === selectedAsignatura);
  if (profesor) {
    claveProfesorSpan.textContent = `Profesor: ${profesor.NOMBREPROFESOR}`;
  } else {
    claveProfesorSpan.textContent = '';
  }
};

const mostrarAlumnos = () => {
  if (!selectedAsignatura || !selectedEval) {
    table.innerHTML = "";
    return;
  }

  let content = "";
  const seen = new Set();
  let counter = skip + 1; 

  const alumnosFiltrados = alumnosData.filter(alumno => {
    return alumno.CLAVEASIGNATURA === selectedAsignatura && alumno.ID_EVAL === selectedEval;
  });

  alumnosFiltrados.forEach(item => {
    const uniqueKey = `${item.NUMEROALUMNO}-${item.ID_PLAN}-${item.CLAVEASIGNATURA}-${item.ID_EVAL}`;

    if (seen.has(uniqueKey)) {
      return;
    }

    seen.add(uniqueKey);

    content += `<tr  style="text-align: center;" data-numeroalumno="${item.NUMEROALUMNO}" data-claveasignatura="${item.CLAVEASIGNATURA}" data-id_eval="${item.ID_EVAL}" data-inicial="${item.INICIAL}" data-final="${item.FINAL}" data-periodo="${item.PERIODO}">`;
    content += `<td>${counter}</td>`;  
    content += `<td>${item.PATERNO} ${item.MATERNO} ${item.NOMBRE}</td>`;
    content += `<td>${item.MATRICULA}</td>`;
    content += `<td ><input style="text-align: center;" class="calificacion-input" value="${item.CALIFICACION}" size="1"></td>`;
    content += `<td><input style="text-align: center;" type="date" class="fecha" value="${formatFecha(item.FECHA)}" size="3"></td>`;
    content += `<td><button class="save-btn" onclick="guardarCalificacion(${item.NUMEROALUMNO})">Guardar</button></td>`;
    content += "</tr>";

    counter++;
  });

  table.innerHTML = content;
};


const guardarCalificacion = async (numeroalumno) => {
  const row = document.querySelector(`tr[data-numeroalumno="${numeroalumno}"]`);
  if (!row) {
    alert(`No se encontró la fila para el alumno ${numeroalumno}`);
    return;
  }

  const claveasignatura = row.dataset.claveasignatura;
  const id_eval = row.dataset.id_eval;
  const inicial = row.dataset.inicial;
  const final = row.dataset.final;
  const periodo = row.dataset.periodo;
  const calificacion = row.querySelector('.calificacion-input').value;
  const fecha = row.querySelector('.fecha').value;

  if (!fecha) {
    alert(`La fecha para el alumno ${numeroalumno} no puede estar vacía.`);
    return;
  }

  const alumno = { numeroalumno, claveasignatura, id_eval, inicial, final, periodo, calificacion, fecha };

  try {
    await actualizarAlumno(alumno);
    alert(`Los datos del alumno ${numeroalumno} han sido actualizados correctamente.`);
  } catch (error) {
    alert(`Error al actualizar los datos del alumno ${numeroalumno}: ${error.message}`);
  }
};

const actualizarAlumno = async (alumno) => {
  const { numeroalumno, claveasignatura, id_eval, inicial, final, periodo, calificacion, fecha } = alumno;
  const url = `/api/gruposcalifi_alumnos/${idGrupo.value}`;

  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ numeroalumno, claveasignatura, id_eval, inicial, final, periodo, calificacion, fecha })
  });

  if (!res.ok) {
    throw new Error(`Error al actualizar los datos del alumno ${numeroalumno}`);
  }
};

const actualizarTodasCalificaciones = async () => {
  const rows = table.querySelectorAll('tr');
  const updates = [];

  let hasEmptyDate = false;

  rows.forEach(row => {
    const numeroalumno = row.dataset.numeroalumno;
    const claveasignatura = row.dataset.claveasignatura;
    const id_eval = row.dataset.id_eval;
    const inicial = row.dataset.inicial;
    const final = row.dataset.final;
    const periodo = row.dataset.periodo;
    const calificacion = row.querySelector('.calificacion-input').value;
    const fecha = row.querySelector('.fecha').value;

    if (!fecha) {
      hasEmptyDate = true;
    } else {
      updates.push({ numeroalumno, claveasignatura, id_eval, inicial, final, periodo, calificacion, fecha });
    }
  });

  if (hasEmptyDate) {
    crearModalFecha(); 
    return;
  }

  try {
    for (const alumno of updates) {
      await actualizarAlumno(alumno);
    }
    alert('Todas las calificaciones han sido actualizadas');
  } catch (error) {
    alert(error.message);
  }

  getAlumnos(); 
};


const crearModalFecha = () => {
  const modalBackground = document.createElement('div');
  modalBackground.id = 'modal-background';
  modalBackground.style.position = 'fixed';
  modalBackground.style.top = 0;
  modalBackground.style.left = 0;
  modalBackground.style.width = '100%';
  modalBackground.style.height = '100%';
  modalBackground.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
  modalBackground.style.display = 'flex';
  modalBackground.style.alignItems = 'center';
  modalBackground.style.justifyContent = 'center';

  const modalContainer = document.createElement('div');
  modalContainer.id = 'modal-container';
  modalContainer.style.backgroundColor = 'white';
  modalContainer.style.padding = '20px';
  modalContainer.style.borderRadius = '5px';
  modalContainer.style.width = '400px';
  modalContainer.style.textAlign = 'center';

  const modalTitle = document.createElement('h4');
  modalTitle.textContent = 'Seleccione una fecha para todos los alumnos';
  modalContainer.appendChild(modalTitle);

  const fechaInput = document.createElement('input');
  fechaInput.type = 'date';

  const hoy = new Date();
const offset = hoy.getTimezoneOffset();
const fechaLocal = new Date(hoy.getTime() - (offset * 60 * 1000)).toISOString().split('T')[0];
fechaInput.value = fechaLocal;

  
  modalContainer.appendChild(fechaInput);

  const buttonContainer = document.createElement('div');
  buttonContainer.style.display = 'flex';
  buttonContainer.style.justifyContent = 'space-around';
  buttonContainer.style.marginTop = '7px';

  const btnFechaNormal = document.createElement('button');
  btnFechaNormal.textContent = 'Actualizar fecha';
  btnFechaNormal.style.flex = '1';
  btnFechaNormal.style.margin = '0 5px';
  btnFechaNormal.style.backgroundColor = '#4CAF50'; 
  btnFechaNormal.style.color = 'white';
  btnFechaNormal.style.border = 'none';
  btnFechaNormal.style.padding = '7xp';
  btnFechaNormal.style.borderRadius = '5px';
  btnFechaNormal.style.cursor = 'pointer';

  const btnFechaNula = document.createElement('button');
  btnFechaNula.textContent = 'Fecha Nula';
  btnFechaNula.style.flex = '1';
  btnFechaNula.style.margin = '0 5px';
  btnFechaNula.style.backgroundColor = '#f44336'; 
  btnFechaNula.style.color = 'white';
  btnFechaNula.style.border = 'none';
  btnFechaNula.style.padding = '7xp';
  btnFechaNula.style.borderRadius = '5px';
  btnFechaNula.style.cursor = 'pointer';

  const btnCancelar = document.createElement('button');
  btnCancelar.textContent = 'Cancelar';
  btnCancelar.style.flex = '1';
  btnCancelar.style.margin = '0 5px';
  btnCancelar.style.backgroundColor = '#9e9e9e'; 
  btnCancelar.style.color = 'white';
  btnCancelar.style.border = 'none';
  btnCancelar.style.padding = '7xp';
  btnCancelar.style.borderRadius = '5px';
  btnCancelar.style.cursor = 'pointer';

  buttonContainer.appendChild(btnFechaNormal);
  buttonContainer.appendChild(btnFechaNula);
  buttonContainer.appendChild(btnCancelar);

  modalContainer.appendChild(buttonContainer);

  modalBackground.appendChild(modalContainer);
  document.body.appendChild(modalBackground);

  btnFechaNormal.addEventListener('click', () => {
    const nuevaFecha = fechaInput.value || '01/01/1900';
    actualizarFechaParaTodos(nuevaFecha);
    document.body.removeChild(modalBackground);
  });

  btnFechaNula.addEventListener('click', () => {
    actualizarFechaParaTodos('01/01/1900');
    document.body.removeChild(modalBackground);
  });

  btnCancelar.addEventListener('click', () => {
    document.body.removeChild(modalBackground);
  });
};



const actualizarFechaParaTodos = async (fechaFinal) => {
  const rows = table.querySelectorAll('tr');
  const updates = [];

  rows.forEach(row => {
    const numeroalumno = row.dataset.numeroalumno;
    const claveasignatura = row.dataset.claveasignatura;
    const id_eval = row.dataset.id_eval;
    const inicial = row.dataset.inicial;
    const final = row.dataset.final;
    const periodo = row.dataset.periodo;
    const calificacion = row.querySelector('.calificacion-input').value;

    updates.push({ numeroalumno, claveasignatura, id_eval, inicial, final, periodo, calificacion, fecha: fechaFinal });
  });

  try {
    for (const alumno of updates) {
      await actualizarAlumno(alumno);
    }
    alert(`La fecha ha sido actualizada para todos los alumnos con la fecha: ${fechaFinal}`);
  } catch (error) {
    alert(error.message);
  }

  getAlumnos();
};

updateAllBtn.addEventListener('click', actualizarTodasCalificaciones);
updateDateBtn.addEventListener('click', crearModalFecha);

getAlumnos();