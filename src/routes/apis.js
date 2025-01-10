const express = require("express");
const router = express.Router();


const {
  Alumno,
  Ciclos,
  Grupos,
  Pagosalum,
  Niveles,
  Doctos,
  AlumnosGrupos,
  AlumnosNiveles,
  AlumKardex,
  CfgStatus,
  Planes_Mst,
  Planes_Eval,
  Planes_Det,
  Profesores,
  VillasMst,
  VillasCfg,
  ProfesoresGrupos,
  CiclosAdmins,
  Empresas,
  Empleados,
  CFGDoctos, // Agrega esta línea para importar el modelo CFGDoctos
} = require("../app/models");
const Firebird = require("../app/models/Firebird");
const GrupoAlumnos = require("../app/models/GrupoAlumno");


router.get("/grupos", async (req, res) => {
  const {
    skip = 0,
    limit = 30,
    search = "",
    orderBy = "codigo_carrera",
    sort = "asc",
    grupo = "",
    grado = 0,
  } = req.query;
  //    "grupos.codigo_grupo as codigo_grupo,grupos.grado, grupos.inicial as inicial,grupos.final as final,grupos.periodo as periodo,grupos.id_escuela as id_escuela,CASE WHEN grupos.grado + 1 >= 5 THEN grupos.grado ELSE grupos.grado + 1  END  as siguiente_grupo , grupos.grupo as grupo, grupos.cupo_maximo, grupos.inscritos, profesores.nombreprofesor as claveprofesor_titular, cfgniveles.nivel as codigo_carrera ";

  // Consulta SQL paar mostrar los grupos
  let query = `SELECT FIRST(${limit}) SKIP(${skip}) `;
  query +=
    "grupos.codigo_grupo as codigo_grupo,grupos.grado, grupos.inicial,grupos.final,grupos.periodo as periodo,grupos.id_escuela as id_escuela, grupos.grupo as grupo, grupos.cupo_maximo, grupos.inscritos, profesores.nombreprofesor as claveprofesor_titular, cfgniveles.nivel as codigo_carrera ";
  query += "FROM grupos ";
  query +=
    "LEFT JOIN profesores ON grupos.claveprofesor_titular = profesores.claveprofesor ";
  query += "JOIN cfgniveles ON grupos.nivel = cfgniveles.nivel ";

  // Si hay palabras a bsucar, lo agrega en la consulta
  if (search.length > 0) {
    query += `WHERE (grupos.codigo_grupo LIKE '%${search.toLocaleUpperCase()}%') `;
  }
  if (grupo.length > 0) {
    query += `AND (grupos.nivel LIKE '%${grupo.toLocaleUpperCase()}%') `;
  }
  if (grado > 0) {
    let grado_alumno = parseFloat(grado) + 1;
    query += `AND grupos.grado <= '${grado_alumno}' AND grupos.grado >= '${grado}'`;
  }
  // Si hay periodo seleccionado a mostrar lo agrega en la query
  if (req.session.periodoSelected) {
    let periodo = await Ciclos.findById(req.session.periodoSelected);
    // Valida si ya tiene la consulta WHERE
    query += query.includes("WHERE") ? "AND" : "WHERE";
    // si lo tiene agrega un AND,  si no, agrega el WHERE
    query += ` grupos.inicial = ${periodo?.INICIAL} `;
    query += `AND grupos.final = ${periodo?.FINAL} `;
    query += `AND grupos.periodo = ${periodo?.PERIODO} `;
  }

  // Codigo para ordenar si existe
  query += `ORDER BY ${orderBy} ${sort}`;

  const grupos = await Grupos.createQuery({ querySql: query });

  res.json({
    querys: {
      limit,
      skip,
      search,
      orderBy,
      sort
    },
    periodoSelected: req.session.periodoSelected,
    grupos,
  });
});

router.get("/grupos_alumnos/:idGrupo", async (req, res) => {
  const { limit = 10, skip = 0 } = req.query;
  const idGrupo = req.params.idGrupo;

  let sql = `SELECT FIRST ${limit} SKIP ${skip} `;
  sql += `ALUMNOS.MATRICULA, ALUMNOS.PATERNO, ALUMNOS.MATERNO, ALUMNOS.NOMBRE, ALUMNOS.NIVEL, ALUMNOS.GENERO, ALUMNOS.STATUS `;
  sql += `FROM ALUMNOS_GRUPOS `;
  sql += `LEFT JOIN ALUMNOS ON ALUMNOS_GRUPOS.NUMEROALUMNO = ALUMNOS.NUMEROALUMNO `;
  sql += `WHERE ALUMNOS_GRUPOS.CODIGO_GRUPO = '${idGrupo}' `;

  // Si hay periodo seleccionado a mostrar lo agrega en la query
  if (req.session.periodoSelected) {
    let periodo = await Ciclos.findById(req.session.periodoSelected);

    sql += `AND ALUMNOS_GRUPOS.INICIAL = ${periodo?.INICIAL} `;
    sql += `AND ALUMNOS_GRUPOS.FINAL = ${periodo?.FINAL} `;
    sql += `AND ALUMNOS_GRUPOS.PERIODO = ${periodo?.PERIODO} `;
  }

  // Ordena la tabla por apellidos en orden alfabético
  sql += `ORDER BY ALUMNOS.PATERNO ASC`;

  try {
    const alumnos = await AlumnosGrupos.createQuery({ querySql: sql });

    res.json({
      querys: {
        limit,
        skip
      },
      idGrupo,
      alumnos,
    });
  } catch (error) {
    console.error('Error al ejecutar la consulta SQL:', error);
    res.status(500).json({ error: 'Error al obtener los alumnos del grupo' });
  }
});



//////////////////////////Filtro para calificacion por alumno/////////////////////////////////////////////////////////////////

router.get("/gruposCalifi", async (req, res) => {
  const {
    skip = 0,
    limit = 30,
    search = "",
    orderBy = "codigo_carrera",
    sort = "asc",
    grupo = "",
    grado = 0,
  } = req.query;
  //    "grupos.codigo_grupo as codigo_grupo,grupos.grado, grupos.inicial as inicial,grupos.final as final,grupos.periodo as periodo,grupos.id_escuela as id_escuela,CASE WHEN grupos.grado + 1 >= 5 THEN grupos.grado ELSE grupos.grado + 1  END  as siguiente_grupo , grupos.grupo as grupo, grupos.cupo_maximo, grupos.inscritos, profesores.nombreprofesor as claveprofesor_titular, cfgniveles.nivel as codigo_carrera ";

  // Consulta SQL paar mostrar los grupos
  let query = `SELECT FIRST(${limit}) SKIP(${skip}) `;
  query +=
    "grupos.codigo_grupo as codigo_grupo,grupos.grado, grupos.inicial,grupos.final,grupos.periodo as periodo,grupos.id_escuela as id_escuela, grupos.grupo as grupo, grupos.cupo_maximo, grupos.inscritos, profesores.nombreprofesor as claveprofesor_titular, cfgniveles.nivel as codigo_carrera ";
  query += "FROM grupos ";
  query +=
    "LEFT JOIN profesores ON grupos.claveprofesor_titular = profesores.claveprofesor ";
  query += "JOIN cfgniveles ON grupos.nivel = cfgniveles.nivel ";

  // Si hay palabras a bsucar, lo agrega en la consulta
  if (search.length > 0) {
    query += `WHERE (grupos.codigo_grupo LIKE '%${search.toLocaleUpperCase()}%') `;
  }
  if (grupo.length > 0) {
    query += `AND (grupos.nivel LIKE '%${grupo.toLocaleUpperCase()}%') `;
  }
  if (grado > 0) {
    let grado_alumno = parseFloat(grado) + 1;
    query += `AND grupos.grado <= '${grado_alumno}' AND grupos.grado >= '${grado}'`;
  }
  // Si hay periodo seleccionado a mostrar lo agrega en la query
  if (req.session.periodoSelected) {
    let periodo = await Ciclos.findById(req.session.periodoSelected);
    // Valida si ya tiene la consulta WHERE
    query += query.includes("WHERE") ? "AND" : "WHERE";
    // si lo tiene agrega un AND,  si no, agrega el WHERE
    query += ` grupos.inicial = ${periodo?.INICIAL} `;
    query += `AND grupos.final = ${periodo?.FINAL} `;
    query += `AND grupos.periodo = ${periodo?.PERIODO} `;
  }


  // Codigo para ordenar si existe
  query += `ORDER BY ${orderBy} ${sort}`;

  const grupos = await Grupos.createQuery({ querySql: query });

  res.json({
    querys: {
      limit,
      skip,
      search,
      orderBy,
      sort
    },
    periodoSelected: req.session.periodoSelected,
    grupos,
  });
});

router.get("/gruposCalifi_alumnos/:idGrupo", async (req, res) => {
  const { limit = 10, skip = 0 } = req.query;
  const idGrupo = req.params.idGrupo;

  let sql = `SELECT FIRST ${limit} SKIP ${skip} `;
  sql += `grupos.grado, `;
  sql += `alumnos_grupos.codigo_grupo, `;
  sql += `alumnos.matricula, alumnos.paterno, alumnos.materno, alumnos.nombre, `;
  sql += `alumnos_kardex.id_plan, alumnos_kardex.claveasignatura, alumnos_kardex.id_eval, alumnos_kardex.calificacion, alumnos_kardex.inicial, alumnos_kardex.final, ALUMNOS_KARDEX.PERIODO, ALUMNOS_KARDEX.NUMEROALUMNO, alumnos_kardex.fecha, `;
  sql += `cfgplanes_mst.nombre_plan, `;
  sql += `cfgplanes_det.nombreasignatura, `;
  sql += `cfgplanes_eval.descripcion AS nombre_eval, `;
  sql += `profesores_grupos.claveprofesor, `;
  sql += `profesores.nombreprofesor `;

  sql += `FROM alumnos_grupos `;

  sql += `LEFT JOIN alumnos ON alumnos_grupos.numeroalumno = alumnos.numeroalumno `;

  sql += `LEFT JOIN grupos ON alumnos_grupos.codigo_grupo = grupos.codigo_grupo `;
  sql += `AND alumnos_grupos.INICIAL = GRUPOS.INICIAL `;
  sql += `AND alumnos_grupos.FINAL = GRUPOS.FINAL `;
  
  sql += `left join alumnos_kardex on alumnos_grupos.numeroalumno = alumnos_kardex.numeroalumno `;
  sql += `AND alumnos_grupos.INICIAL = alumnos_kardex.INICIAL `;
  sql += `AND alumnos_grupos.FINAL = alumnos_kardex.FINAL `;
  sql += `AND alumnos_grupos.PERIODO = alumnos_kardex.PERIODO `;
  
  sql += `left join cfgplanes_mst on alumnos_kardex.id_plan = cfgplanes_mst.id_plan `;
  sql += `left join cfgplanes_det on alumnos_kardex.claveasignatura = cfgplanes_det.claveasignatura `;
  sql += `AND grupos.grado = cfgplanes_det.grado `;

  sql += `left join cfgplanes_eval on alumnos_kardex.id_plan = cfgplanes_eval.id_plan `;
  sql += `AND alumnos_kardex.id_eval = cfgplanes_eval.id_eval `;

  sql += `left join profesores_grupos on ALUMNOS_KARDEX.id_plan = profesores_grupos.id_plan `;
  sql += `AND ALUMNOS_KARDEX.CLAVEASIGNATURA = profesores_grupos.CLAVEASIGNATURA `;
  sql += `AND ALUMNOS_KARDEX.INICIAL = profesores_grupos.INICIAL `;
  sql += `AND ALUMNOS_KARDEX.FINAL = profesores_grupos.FINAL `;
  sql += `AND grupos.codigo_grupo = profesores_grupos.codigo_grupo `;

  sql += `left join profesores on profesores_grupos.claveprofesor = profesores.claveprofesor `;

 


  sql += `WHERE alumnos_grupos.codigo_grupo = '${idGrupo}' `;

  // Si hay periodo seleccionado a mostrar lo agrega en la query
  if (req.session.periodoSelected) {
    let periodo = await Ciclos.findById(req.session.periodoSelected);

    sql += `AND alumnos_grupos.inicial = ${periodo?.INICIAL} `;
    sql += `AND alumnos_grupos.final = ${periodo?.FINAL} `;
    sql += `AND alumnos_grupos.periodo = ${periodo?.PERIODO} `;
  }

  // Ordena la tabla por apellidos en orden alfabetico
  sql += `ORDER BY alumnos.paterno ASC`;

  try {
    const alumnos = await AlumnosGrupos.createQuery({ querySql: sql });

    res.json({
      querys: {
        limit,
        skip
      },
      idGrupo,
      alumnos,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/gruposCalifi_alumnos/:idGrupo", async (req, res) => {
  const { numeroalumno, claveasignatura, id_eval, inicial, final, periodo, calificacion, fecha } = req.body;

  // Construir la consulta SQL para actualizar los datos
  let sql = `UPDATE alumnos_kardex SET `;
  sql += `calificacion = '${calificacion}', `;
  // Solo agrega la fecha si no está vacía o undefined
  if (fecha) {
    sql += `fecha = '${fecha}', `;
  }
  // Elimina la última coma y espacio adicional
  sql = sql.slice(0, -2); 
  sql += ` WHERE numeroalumno = '${numeroalumno}' `;
  sql += `AND claveasignatura = '${claveasignatura}' `;
  sql += `AND id_eval = '${id_eval}' `;
  sql += `AND inicial = '${inicial}' `;
  sql += `AND final = '${final}' `;
  sql += `AND periodo = '${periodo}'`;

  try {
    await AlumnosGrupos.createQuery({ querySql: sql });

    res.json({
      message: 'Datos actualizados exitosamente',
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});





///////////////////////////////////Fin de filtro de calificacion por alumno//////////////////////////////////////////////////////////////////////

router.get("/cuatris-navbar", async (req, res) => {
  const { limit = 100 } = req.query;

  const ciclos = await Ciclos.all({
    limit,
  });

  let periodoSelected = await Ciclos.findById(req.session.periodoSelected);

  res.json({
    periodoSelected: periodoSelected?.DESCRIPCION,
    ciclos,
  });
});

router.put("/update/CuatriXGrupos", async (req, res) => {
  const { periodo } = req.body;

  // Actualiza el periodo a mostrar en la API de grupos
  if (periodo === "none") {
    req.session.periodoSelected = null;
  } else {
    req.session.periodoSelected = periodo;
  }

  res.json({
    res: "Periodo actualizado",
  });
});

// Cuatrimestres / Ciclos
router.get("/cuatrimestres", async (req, res) => {
  const { limit, skip, search } = req.query;

  let searchQuery = "";

  if (search) {
    searchQuery = `(codigo_corto LIKE '%${search.toUpperCase()}%') `;
    searchQuery += `OR (descripcion LIKE '%${search}%')`;
  }

  const ciclos = await Ciclos.all({
    limit,
    skip,
    searchQuery,
    orderBy: 'inicial',
    sort: 'desc'
  });

  res.json({
    querys: {
      limit,
      skip,
      search
    },
    ciclos,
  });
});

router.get('/ciclosAdmi', async (_req, res) => {
  try {
    const ciclosAdmins = await CiclosAdmins.createQuery({ querySql: "SELECT * FROM CICLOS_ADMINS" })
    res.json(ciclosAdmins);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error en la consulta de la base de datos' });
  }
});

router.get("/alumnos", async (req, res) => {
  const { limit = 15, skip = 0, search, orderBy = "paterno", sort = "asc" } = req.query;

  let searchQuery = null;

  // Si hay palabras a buscar, lo agrega en la consulta
  if (search) {
    searchQuery = `(matricula LIKE '%${search}%') `;
    searchQuery += `OR (nombre LIKE '%${search}%') `;
    searchQuery += `OR (paterno LIKE '%${search}%') `;

    let searchLastName = search.split(" ");
    if (searchLastName.length > 1) {
      searchQuery += `OR (paterno LIKE '%${searchLastName[0]}%' AND materno LIKE '%${searchLastName[1]}%') `;
    }
  }

  const alumnos = await Alumno.all({
    limit,
    skip,
    searchQuery,
    orderBy,
    sort,
  });

  res.json({
    querys: {
      limit,
      skip,
      search,
      orderBy,
      sort
    },
    alumnos,
  });
});

router.get("/carreras", async (req, res) => {
  const { limit, skip, search } = req.query;

  let searchQuery = null;

  if (search) {
    searchQuery = `descripcion LIKE '%${search}%'`;
  }

  const niveles = await Niveles.all({
    limit,
    skip,
    searchQuery,
    orderBy: "descripcion",
  });

  res.json({
    querys: {
      limit,
      skip,
      search
    },
    niveles,
  });
});

router.get("/doctos/", async (req, res) => {
  const { grado, numalumno } = req.query;

  if (!grado || !numalumno) {
    return res.json({
      error: 'Se necesita el grado a buscar y el numero del alumno'
    });
  }

  const doctos = await Doctos.where({
    grado: [grado],
    clave: [numalumno]
  }, {
    strict: true,
  });

  res.json({
    query: {
      grado,
      numalumno
    },
    doctos,
  });
});

router.get("/calificaciones/asignaturas", async (req, res) => {
  const { idPlan = "", idAsig = "", idEval = "", idGrupo = "" } = req.query;

  if (!idGrupo || !idPlan || !idAsig || !idEval) {
    return res.json({
      error: "El id del grupo, plan, evaluacion y asignatura son necesarios",
      querys: {
        idPlan,
        idAsig,
        idEval,
        idGrupo,
      }
    })
  };

  try {

    let grupo = await Grupos.findById(idGrupo);

    let data = await AlumKardex.where({
      id_plan: [idPlan],
      id_eval: [idEval],
      claveasignatura: [idAsig],
      inicial: [grupo.INICIAL],
      final: [grupo.FINAL],
      // periodo: [grupo.PERIODO],
    }, { limit: 35 });

    res.json({
      querys: {
        idPlan,
        idAsig,
        idEval,
        idGrupo,
      },
      data,
    });

  } catch (error) {
    res.json({
      error: "El id del grupo y el plan no coinciden para la consulta"
    })
  }
});

// Api para consultar calificaciones por grupos
router.get("/calificaciones", async (req, res) => {
  const {
    idPlan,
    grupo,
    claveAsig,
    idEtapa,
    idEval = "A",
    inicial,
    final,
    periodo,
  } = req.query;

  if (!idPlan || !claveAsig) {
    return res.json({
      error: "Hace faltan datos para la operación"
    });
  };

  try {

    let plan = await Planes_Mst.findById(idPlan);

    if (!plan) {
      return res.json({
        error: "No existe el plan"
      });
    }

    let sql = `
      select alumnos.matricula,
        alumnos.numeroalumno,
        alumnos.nombre,
        alumnos.paterno,
        alumnos.materno,
        alumnos_kardex.calificacion,
        alumnos_kardex.fecha,
        alumnos_kardex.id_eval,
        alumnos_kardex.id_plan

      from alumnos_kardex

      inner join alumnos on alumnos_kardex.numeroalumno = alumnos.numeroalumno
      inner join alumnos_grupos on alumnos_kardex.numeroalumno = alumnos_grupos.numeroalumno
        and alumnos_kardex.inicial = alumnos_grupos.inicial
        and alumnos_kardex.final = alumnos_grupos.final
        and alumnos_kardex.periodo = alumnos_grupos.periodo

      where alumnos_kardex.id_plan = '${idPlan}'
        and alumnos_kardex.claveasignatura = '${claveAsig}'
        and alumnos_kardex.id_etapa = '${idEtapa}'
        and alumnos_kardex.id_eval = '${idEval}'
        and alumnos_kardex.inicial = '${inicial}'
        and alumnos_kardex.final = '${final}'
        and alumnos_kardex.periodo = '${periodo}'
        and alumnos_grupos.codigo_grupo = '${grupo}'

      order by paterno`;

    let data = await Grupos.createQuery({ querySql: sql });

    res.json({
      querys: {
        idPlan,
        grupo,
        claveAsig,
        idEtapa,
        idEval,
        inicial,
        final,
        periodo,
      },
      data,
    });

  } catch (error) {
    res.json({
      error: "Algunos datos no coinciden para la consulta",
      querys: req.query
    })
  }
});

// Api para subir calificaciones
router.post("/calificaciones", (req, res) => {

  const {
    claveAsig,
    idEtapa,
    idPlan,
    idEval,
    inicial,
    final,
    periodo
  } = req.query;

  const dataCalif = req.body;
  let promises = [];

  for (const key in dataCalif) {
    let sql = `UPDATE alumnos_kardex SET calificacion = ?
      WHERE numeroalumno = ? 
        and claveasignatura = '${claveAsig}' 
        and id_plan = '${idPlan}'
        and id_eval = '${idEval}'
        and id_etapa = '${idEtapa}'
        and inicial = ${inicial} 
        and final = ${final}
        and periodo = ${periodo}`;

    promises.push(AlumKardex.createQuery({
      querySql: sql,
      data: [dataCalif[key], key],
    }));
  }

  Promise.all(promises).then(() => {
    res.json({
      msj: "Datos actualizados correctamente",
    })
  })
});

router.post("/grupos_add", async (req, res) => {

  const gruposAlumnos = req.body; // Obtener los  del cuerpo de la solicitud

  // Extraer los campos individuales de nueva grupos alumno
  const {
    ID_ESCUELA,
    INICIAL,
    FINAL,
    PERIODO,
    NUMEROALUMNO,
    NUM,
    TIPO,
    CODIGO_GRUPO,
    GRADO,
    NIVEL,
    STATUS,
    TIPOEXAMEN,
    FECHA_CREACION,
    REINSCRITO,
    INFORMACIONALUMNO
  } = gruposAlumnos;
  // Ejecutar la sentencia INSERT en la base de datos
  const query = `
    INSERT INTO ALUMNOS_GRUPOS (
      ID_ESCUELA,
      INICIAL,
      FINAL,
      PERIODO,
      NUMEROALUMNO,
      NUM,
      TIPO,
      CODIGO_GRUPO,
      TIPOEXAMEN,
      REINSCRITO
    )
    VALUES (
      ${ID_ESCUELA},
      '${INICIAL}',
      '${FINAL}',
      '${PERIODO}',
      '${NUMEROALUMNO}',
      '${NUM}',
      '${TIPO}',
      '${CODIGO_GRUPO}',
      '${TIPOEXAMEN}',
      '${REINSCRITO}'
    )
  `;

  const queryNivel = `
    INSERT INTO ALUMNOS_NIVELES (
      ID_ESCUELA,
      NUMEROALUMNO,
      INICIAL,
      FINAL,
      PERIODO,
      NIVEL,
      GRADO,
      STATUS,
      FECHA_CREACION
    )
    VALUES (
      ${ID_ESCUELA},
      '${NUMEROALUMNO}',
      '${INICIAL}',
      '${FINAL}',
      '${PERIODO}',
      '${NIVEL}',
      '${GRADO}',
      '${STATUS}',
      '${FECHA_CREACION}'
    )
  `;



  const data = {
    grado: INFORMACIONALUMNO.GRADO + 1,
    matricula: INFORMACIONALUMNO.MATRICULA
  };



  try {


    // Ejecutar la consulta en la base de datos (asegúrate de tener configurada la conexión a la base de datos correctamente)
    const alumnos = await AlumnosGrupos.createQuery({ querySql: query });
    const alumnos_nivel = await AlumnosNiveles.createQuery({ querySql: queryNivel });
    const alumno = await Alumno.findByIdAndUpdate(INFORMACIONALUMNO.MATRICULA, data);


    res.status(200)({ message: 'Registro realizado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al realizar el regisro' });
  }

});

router.get("/planes", async (req, res) => {
  const {
    page = 1,
    search = '',
    nivel = ''
  } = req.query;

  let searchQuery = '';

  if (page <= 0) page = 1;

  if (search) {
    searchQuery += `nombre_plan LIKE '%${search.toUpperCase()}%'`
  }

  if (nivel) {
    if (search) searchQuery += ' AND '
    searchQuery += `nivel = '${nivel}'`
  }

  const planes = await Planes_Mst.all({
    limit: 20,
    skip: (page - 1) * 20,
    searchQuery,
    orderBy: 'nombre_plan',
    sort: 'asc',
  });

  res.json({
    query: {
      page,
      search,
      nivel
    },
    data: planes
  })

});

router.get("/planes/:idPlan/asig", async (req, res) => {
  const { idPlan = "" } = req.params;
  const asigs = await Planes_Det.where(
    {
      id_plan: [idPlan],
      id_tipoeval: ["A"],
    },
    { strict: true, limit: 50 }
  );

  res.json({
    querys: null,
    data: asigs
  });
});

router.get("/planes/:idPlan/eval", async (req, res) => {
  const { idPlan } = req.params;
  const evals = await Planes_Eval.where(
    { id_plan: [idPlan] },
    { strict: true }
  );

  res.json({
    querys: null,
    data: evals
  })
});

// Calificaciones por alumno
router.get("/calificaciones/:numalumno", async (req, res) => {
  const { cuatri = 1, eval = "A" } = req.query;
  const alumno = req.params.numalumno;

  let sql = `select first(30)
    alumnos_kardex.numeroalumno,
    alumnos_kardex.claveasignatura,
    cfgplanes_det.nombreasignatura,
    alumnos_kardex.id_plan,
    alumnos_kardex.id_eval,
    alumnos_kardex.calificacion
  from alumnos_kardex
  join cfgplanes_det on alumnos_kardex.claveasignatura = cfgplanes_det.claveasignatura
    and alumnos_kardex.id_plan = cfgplanes_det.id_plan
    and alumnos_kardex.id_etapa = cfgplanes_det.id_etapa
  where (alumnos_kardex.numeroalumno = ${alumno})
    and (alumnos_kardex.id_eval = '${eval}')
    and (cfgplanes_det.grado = ${cuatri})`;

  const data = await AlumKardex.createQuery({
    querySql: sql
  })

  res.json({
    query: {
      cuatri,
      eval
    },
    data
  })

});

router.get("/estatus", async (req, res) => {
  const { search = "" } = req.query;

  let searchQuery = null;
  if (search) {
    searchQuery = `descripcion LIKE '%${search}%'`;
  }

  const status = await CfgStatus.all({
    limit: 50,
    searchQuery,
  })

  res.json({
    querys: search,
    data: status
  })
});

router.get("/profesores", async (req, res) => {
  const { search = "", page = 1 } = req.query;

  let searchQuery = "";

  if (search) {
    searchQuery += `nombreprofesor like '%${search}%'`;
  }

  const profes = await Profesores.all({
    searchQuery,
    limit: 20,
    skip: (page - 1) * 20,
  });

  res.json({
    query: {
      search,
      page
    },
    data: profes
  })

});

router.get("/profesores/:id/grupos", async (req, res) => {
  const idProfesor = req.params.id;

  const { page = 1 } = req.query;

  if (page <= 0) page = 1;

  let sql = `select first(${page * 20}) skip(${(page - 1) * 20}) *
    from profesores_grupos
    join cfgplanes_det as asig
    on profesores_grupos.id_plan = asig.id_plan
    and profesores_grupos.id_etapa = asig.id_etapa
    and profesores_grupos.claveasignatura = asig.claveasignatura
    where claveprofesor = '${idProfesor}' `;

  let periodoSelected = req.session.periodoSelected;

  if (periodoSelected) {
    let ciclos = await Ciclos.findById(periodoSelected);
    sql += `and inicial = ${ciclos.INICIAL} `;
    sql += `and final = ${ciclos.FINAL} `;
    sql += `and periodo = ${ciclos.PERIODO} `;
  }

  let grupos = await ProfesoresGrupos.createQuery({ querySql: sql });

  res.json({
    id_profesor: idProfesor,
    data: grupos,
  })

});

// Obtener todas las empresas
router.get('/empresas', async (req, res) => {
  try {
    const empresas = await Empresas.getAll();
    res.json(empresas);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las empresas' });
  }
});

// Obtener una empresa por su ID
router.get('/empresas/:id_empresa', async (req, res) => {
  const id_empresa = req.params.id_empresa;
  try {
    const empresa = await Empresas.findById(id_empresa);
    if (empresa) {
      res.json(empresa);
    } else {
      res.status(404).json({ error: 'Empresa no encontrada' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la empresa' });
  }
});

// Agregar una nueva empresa
router.post('/empresas', async (req, res) => {
  const nuevaEmpresa = req.body; // Obtener los datos del cuerpo de la solicitud

  // Extraer los campos individuales de nuevaEmpresa
  const {
    ID_EMPRESA,
    NOMBRE_EMPRESA,
    CEDULA_FISCAL_EMPRESA,
    DOMICILIO_EMPRESA,
    NUMEXT_EMPRESA,
    NUMINT_EMPRESA,
    COLONIA_EMPRESA,
    CP_EMPRESA,
    LOCALIDAD_EMPRESA,
    CIUDAD_EMPRESA,
    ESTADO_EMPRESA,
    TELEFONO1_EMPRESA,
    EMAIL
  } = nuevaEmpresa;

  // Ejecutar la sentencia INSERT en la base de datos
  const query = `
    INSERT INTO CFGEMPRESAS (
      ID_EMPRESA,
      NOMBRE_EMPRESA,
      CEDULA_FISCAL_EMPRESA,
      DOMICILIO_EMPRESA,
      NUMEXT_EMPRESA,
      NUMINT_EMPRESA,
      COLONIA_EMPRESA,
      CP_EMPRESA,
      LOCALIDAD_EMPRESA,
      CIUDAD_EMPRESA,
      ESTADO_EMPRESA,
      TELEFONO1_EMPRESA,
      EMAIL
    )
    VALUES (
      ?,
      ?,
      ?,
      ?,
      ?,
      ?,
      ?,
      ?,
      ?,
      ?,
      ?,
      ?,
      ?
    )
  `;

  // Crear un array con los valores en el mismo orden que las ? en la consulta
  const values = [
    ID_EMPRESA,
    NOMBRE_EMPRESA,
    CEDULA_FISCAL_EMPRESA,
    DOMICILIO_EMPRESA,
    NUMEXT_EMPRESA,
    NUMINT_EMPRESA,
    COLONIA_EMPRESA,
    CP_EMPRESA,
    LOCALIDAD_EMPRESA,
    CIUDAD_EMPRESA,
    ESTADO_EMPRESA,
    TELEFONO1_EMPRESA,
    EMAIL
  ];

  try {
    // Ejecutar la consulta en la base de datos
    await new Firebird("EMPLEADOS").createQuery({ querySql: query, data: values })

    res.status(201).json({ message: 'Empresa creada exitosamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear la empresa' });
  }
});


// Obtener todos los empleados
router.get('/empleados', async (req, res) => {
  try {
    const empleados = await Empleados.getAll();
    res.json(empleados);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los empleados' });
  }
});

// Obtener un empleado por su NUMEMPLEADO
router.get('/empleados/:numEmpleado', async (req, res) => {
  const numEmpleado = req.params.numEmpleado;
  try {
    const empleado = await Empleados.findByNumEmpleado(numEmpleado);
    if (empleado) {
      res.json(empleado);
    } else {
      res.status(404).json({ error: 'Empleado no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el empleado' });
  }
});

router.get('/edoctos/', async (req, res) => {
  const { grado, numalumno } = req.query;

  if (!grado || !numalumno) {
    return res.json({
      error: 'Se necesita el grado a buscar y el número del alumno',
    });
  }

  try {
    const edoctos = await CFGDoctos.findAll({
      where: {
        GRADO: grado,
        NUMALUMNO: numalumno,
      },
    });

    res.json({
      query: {
        grado,
        numalumno,
      },
      edoctos,
    });
  } catch (error) {
    console.error('Error al consultar los edoctos:', error);
    res.status(500).json({
      error: 'Ocurrió un error al obtener los edoctos.',
    });
  }
});

router.get("/villas", async (req, res) => {
  let villa = await VillasMst.all({
    limit: 10,
  })
  res.json(villa);
});

router.get("/villas/:id", async (req, res) => {
  let villa = await VillasMst.findById(req.params.id);
  res.json(villa);
});

router.get("/villas/:idVilla/cfg", async (req, res) => {
  let cfgVilla = await VillasCfg.where({
    codigo_villa: [req.params.idVilla]
  },
    {
      limit: 10,
    });

  res.json(cfgVilla);
});

router.get("/villas/:idVilla/cfg/:idCfg", async (req, res) => { });

router.post('/GrupAlumnos', async (req, res) => {
  try {

    let data = req.body;
    //se obtiene los datos del alumno
    const {
      ID_ESCUELA,
      INICIAL,
      FINAL,
      PERIODO,
      NUMEROALUMNO,
      NUM,
      TIPO,
      CODIGO_GRUPO
    } = data;
    //se crea el query para grabar en alumnos_grupos
    let query = `SELECT first (1)
    alumnos_grupos.id_escuela,
    alumnos_grupos.inicial,
    alumnos_grupos.final,
    alumnos_grupos.periodo,
    alumnos_grupos.numeroalumno,
    alumnos_grupos.codigo_grupo
    from alumnos_grupos`;

    query += ` WHERE alumnos_grupos.id_escuela = '${ID_ESCUELA}'`;
    query += `AND alumnos_grupos.inicial = ${INICIAL} `;
    query += `AND alumnos_grupos.final = ${FINAL} `;
    query += `AND alumnos_grupos.periodo = ${PERIODO} `;
    query += `AND alumnos_grupos.numeroalumno = ${NUMEROALUMNO} `;
    query += `AND alumnos_grupos.codigo_grupo = '${CODIGO_GRUPO}' `;
    //return res.json(query);
    //se retorna el registro
    const pagosalumData = await GrupoAlumnos.createQuery({ querySql: query });
    res.json(pagosalumData[0]);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error en la consulta de la base de datos' });
  }
});

router.post('/AlumnosNivel', async (req, res) => {
  try {

    let data = req.body;
    //se obtiene los datos del alumno
    const {
      ID_ESCUELA,
      INICIAL,
      FINAL,
      PERIODO,
      NUMEROALUMNO,
      NUM,
      TIPO,
      NIVEL,
      GRADO,
      CODIGO_GRUPO,
      CUATRIMESTRE
    } = data;
    //se crea el query para grabar en alumnos_grupos
    let query = `SELECT first (1)
    alumnos_niveles.id_escuela,
    alumnos_niveles.inicial,
    alumnos_niveles.final,
    alumnos_niveles.periodo,
    alumnos_niveles.numeroalumno,
    alumnos_niveles.nivel,
    alumnos_niveles.grado
    from alumnos_niveles`;

    query += ` WHERE alumnos_niveles.id_escuela = '${ID_ESCUELA}'`;
    query += `AND alumnos_niveles.numeroalumno = ${NUMEROALUMNO} `;
    query += `AND alumnos_niveles.inicial = ${INICIAL} `;
    query += `AND alumnos_niveles.final = ${FINAL} `;
    query += `AND alumnos_niveles.periodo = ${PERIODO} `;
    query += `AND alumnos_niveles.nivel = '${NIVEL}' `;
    query += `AND alumnos_niveles.grado = '${CUATRIMESTRE}' `;
    //se retorna el registro
    const pagosalumData = await AlumnosNiveles.createQuery({ querySql: query });
    res.json(pagosalumData[0]);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error en la consulta de la base de datos' });
  }
});

router.get('/GrupAl', async (_req, res) => {
  try {
    const pagosalumData = await Pagosalum.createQuery({ querySql: "SELECT * FROM CFGPAGOS_DET" });

    res.json(pagosalumData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error en la consulta de la base de datos' });
  }
});
module.exports = router;
