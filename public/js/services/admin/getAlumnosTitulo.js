const getAlumnos = async () => {
  table.innerHTML = "";
  load.style.display = "block";

  const upperCaseSearch = search.toUpperCase();
  const url = `api/alumnos?limit=${limit}&skip=${skip}&search=${upperCaseSearch}&orderBy=${orderBy}&sort=${sort}`;
  try {
    const res = await fetch(url);
    const { alumnos } = await res.json();

    console.log('Datos obtenidos de la API:', alumnos); // Agrega este log para ver los datos

    load.style.display = "none";

    if (!alumnos || alumnos.length === 0) {
      table.innerHTML = "<tr><td colspan='6' style='text-align: center;'>No se encontraron resultados</td></tr>";
      return;
    }

    let content = "";
    const status = {
      A: "Activo",
      E: "Egresado",
      BA: "Baja",
      S: "Aspirantes"
    };

    alumnos.forEach((item, i) => {
      content += `<tr onclick="window.location.href='/alumnos/${item.MATRICULA}'">`;
      content += `<td>${item.NUMEROALUMNO}</td>`;
      content += `<td>${item.PATERNO} ${item.MATERNO}</td>`;
      content += `<td>${item.NOMBRE}</td>`;
      content += `<td>${item.MATRICULA}</td>`;
      content += `<td>${status[item.STATUS] ?? ""}</td>`;
      content += `<td>${item.NIVEL}</td>`;
      content += `<td>${item.ADICIONALES}</td>`;

      // TÍTULO LICENCIATURA
      content += `<td>${item.FOLIO_TITLIC ?? ""}</td>`; // Folio Titulación
      content += `<td>${item.LIBRO_TITLIC ?? ""}</td>`; // Libro Titulación
      content += `<td>${item.FOJA_TITLIC ?? ""}</td>`;  // Foja Titulación
      // CERTIFICADO LICENCIATURA
      content += `<td>${item.FOLIO_CERLIC ?? ""}</td>`; // Folio Certificado
      content += `<td>${item.LIBRO_CERLIC ?? ""}</td>`; // Libro Certificado
      content += `<td>${item.FOJA_CERLIC ?? ""}</td>`;  // Foja Certificado
      // ACTA EXENCIÓN LICENCENCIATURA
      content += `<td>${item.FOLIO_AEXLIC ?? ""}</td>`; // Folio Acta Exención
      content += `<td>${item.LIBRO_AEXLIC ?? ""}</td>`; // Libro Acta Exención
      content += `<td>${item.FOJA_AEXLIC ?? ""}</td>`;  // Foja Acta Exención
      //SERVICIO SOCIAL LICENCIATURA
      content += `<td>${item.FOLIO_CSSLIC ?? ""}</td>`; // Folio Servicio Social
      content += `<td>${item.LIBRO_CSSLIC ?? ""}</td>`; // Libro Servicio Social
      content += `<td>${item.FOJA_CSSLIC ?? ""}</td>`;  // Foja Servicio Social

      content += "</tr>";
    });

    table.innerHTML = content;
    alumnosLength = alumnos.length;
  } catch (error) {
    console.error("Error al obtener los datos:", error);
    load.style.display = "none";
  }
};

const handleOrder = (by) => {
  orderBy = by;
  getAlumnos();
};

const handleSort = (by) => {
  sort = by;
  getAlumnos();
};

const prev = () => {
  if (skip >= limit) {
    skip -= limit;
    getAlumnos();
  }
};

const next = () => {
  if (alumnosLength >= limit) {
    skip += limit;
    getAlumnos();
  }
};

// Inicializa la carga de alumnos
getAlumnos();
