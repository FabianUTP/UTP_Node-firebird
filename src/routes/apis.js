const express = require("express");
const router = express.Router();

const {
  Alumno,
  Ciclos,
  Grupos,
  Niveles,
  Doctos,
  AlumnosGrupos,
  AlumKardex,
  CfgStatus,
  Planes_Etapas,
  Planes_Mst,
  Planes_Eval,
  Planes_Det,
} = require("../app/models");

router.get("/grupos", async (req, res) => {
  const {
    skip = 0,
    limit = 10,
    search = "",
    orderBy = "codigo_carrera",
    sort = "asc",
  } = req.query;

  // Consulta SQL paar mostrar los grupos
  let query = `SELECT FIRST(${limit}) SKIP(${skip}) `;
  query +=
    "grupos.codigo_grupo as codigo_grupo, grupos.grado, grupos.grupo as grupo, grupos.cupo_maximo, grupos.inscritos, profesores.nombreprofesor as claveprofesor_titular, cfgniveles.nivel as codigo_carrera ";
  query += "FROM grupos ";
  query +=
    "LEFT JOIN profesores ON grupos.claveprofesor_titular = profesores.claveprofesor ";
  query += "JOIN cfgniveles ON grupos.nivel = cfgniveles.nivel ";

  // Si hay palabras a bsucar, lo agrega en la consulta
  if (search.length > 0) {
    query += `WHERE (grupos.codigo_grupo LIKE '%${search.toLocaleUpperCase()}%') `;
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

  let sql = `SELECT FIRST(${limit}) SKIP(${skip}) `;
  sql += `alumnos.matricula, alumnos.paterno, alumnos.materno, alumnos.nombre, alumnos.nivel, alumnos.genero, alumnos.status `;
  sql += "FROM alumnos_grupos ";
  sql +=
    "left join alumnos on alumnos_grupos.numeroalumno = alumnos.numeroalumno ";
  sql += `where codigo_grupo = '${idGrupo}' `;

  // Si hay periodo seleccionado a mostrar lo agrega en la query
  if (req.session.periodoSelected) {
    let periodo = await Ciclos.findById(req.session.periodoSelected);

    sql += `AND alumnos_grupos.inicial = ${periodo?.INICIAL} `;
    sql += `AND alumnos_grupos.final = ${periodo?.FINAL} `;
    sql += `AND alumnos_grupos.periodo = ${periodo?.PERIODO} `;
  }

  // Ordena la tabla por apellidos en orden alfabetico
  sql += `order by alumnos.paterno asc`;

  const alumnos = await AlumnosGrupos.createQuery({ querySql: sql });

  res.json({
    querys: {
      limit,
      skip
    },
    idGrupo,
    alumnos,
  });
});

router.get("/cuatris-navbar", async (req, res) => {
  const ciclos = await Ciclos.where({
    periodo: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  }, { limit: 100 });

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

router.get("/alumnos", async (req, res) => {
  const { limit = 15, skip = 0, search, orderBy = "paterno", sort ="asc" } = req.query;

  let searchQuery = null;

  // Si hay palabras a buscar, lo agrega en la consulta
  if (search) {
    searchQuery = `(matricula LIKE '%${search}%') `;
    searchQuery += `OR (nombre LIKE '%${search}%') `;
    searchQuery += `OR (paterno LIKE '%${search}%') `;
    
    let searchLastName = search.split(" ");
    if(searchLastName.length > 1) {
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

  if(!grado || !numalumno) {
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
  const { idGrupo, idPlan } = req.query;

  if(!idGrupo || !idPlan) {
    return res.json({
      error: "El id del grupo y del plan son necesarios"
    })
  };

  try {

    let grupo = await Grupos.findById(idGrupo);
    let plan = await Planes_Etapas.findById(idPlan);

    if(!grupo) {
      return res.json({
        error: "No existe el grupo"
      })
    }

    if(!plan) {
      return res.json({
        error: "No existe el plan"
      })
    }

    let sql = `select first(200) 
        alumnos_kardex.claveasignatura, 
        cfgplanes_det.nombreasignatura,
        alumnos_kardex.id_etapa,
        alumnos_kardex.id_plan
      from alumnos_kardex
      join cfgplanes_det on alumnos_kardex.claveasignatura = cfgplanes_det.claveasignatura
        and alumnos_kardex.id_plan = cfgplanes_det.id_plan
        and alumnos_kardex.id_etapa = cfgplanes_det.id_etapa
        and alumnos_kardex.id_tipoeval = cfgplanes_det.id_tipoeval

      where alumnos_kardex.inicial = ${grupo.INICIAL}
        and alumnos_kardex.final = ${grupo.FINAL}
        and alumnos_kardex.periodo = ${grupo.PERIODO} 
        and alumnos_kardex.id_eval = 'A'
        and (alumnos_kardex.id_plan = '${idPlan}')
        order by alumnos_kardex.claveasignatura`;

    let data = await Grupos.createQuery({ querySql: sql });
    
    res.json({
      querys: {
        idGrupo,
        eval
      },
      data,
    });

  } catch (error) {
    res.json({
      error: "El id del grupo y el plan no coinciden para la consulta"
    })
  }
});

router.get("/calificaciones/asignaturas/alumnos", async (req, res) => {
  const { idGrupo, idPlan, claveAsig } = req.query;

  if(!idGrupo || !idPlan || !claveAsig) {
    return res.json({
      error: "El id del grupo, del plan y la clave asignatura son necesarios"
    })
  };

  try {

    let grupo = await Grupos.findById(idGrupo);
    let plan = await Planes_Etapas.findById(idPlan);

    if(!grupo) {
      return res.json({
        error: "No existe el grupo"
      })
    }

    if(!plan) {
      return res.json({
        error: "No existe el plan"
      })
    }

    let sql = `select first(200) 
        alumnos.paterno,
        alumnos.materno,
        alumnos.nombre,
        alumnos_kardex.numeroalumno, 
        alumnos_kardex.claveasignatura, 
        cfgplanes_det.nombreasignatura,
        alumnos_kardex.calificacion,
        alumnos_kardex.id_eval,
        alumnos_kardex.id_tipoeval,
        alumnos_kardex.id_etapa,
        alumnos_kardex.id_plan
      from alumnos_kardex

      join cfgplanes_det on alumnos_kardex.claveasignatura = cfgplanes_det.claveasignatura
        and alumnos_kardex.id_plan = cfgplanes_det.id_plan
        and alumnos_kardex.id_etapa = cfgplanes_det.id_etapa
        and alumnos_kardex.id_tipoeval = cfgplanes_det.id_tipoeval
      
      join alumnos on alumnos_kardex.numeroalumno = alumnos.numeroalumno

      where alumnos_kardex.inicial = ${grupo.INICIAL}
        and alumnos_kardex.final = ${grupo.FINAL}
        and alumnos_kardex.periodo = ${grupo.PERIODO} 
        and alumnos_kardex.id_eval = 'A'
        and (alumnos_kardex.id_plan = '${idPlan}')
        and (alumnos_kardex.claveasignatura = '${claveAsig}')
        order by alumnos.paterno`;

    let data = await Grupos.createQuery({ querySql: sql });
    
    res.json({
      querys: {
        idGrupo,
        eval
      },
      data,
    });

  } catch (error) {
    res.json({
      error: "El id del grupo y el plan no coinciden para la consulta"
    })
  }
})

router.get("/planes", async (req, res) => {
  const { 
    page = 1, 
    search = '', 
    orderBy = 'nombre_plan', 
    sort = 'asc' 
  } = req.query;

  let searchQuery = '';

  if (page <= 0) page = 1;

  if (search) {
    searchQuery = `nombre_plan LIKE '%${search.toUpperCase()}%'`
  }

  const planes = await Planes_Mst.all({
    limit: 20,
    skip: (page - 1) * 20,
    searchQuery,
    orderBy,
    sort,
  });

  res.json({
    query: {
      page,
      search,
      orderBy,
      sort
    },
    data: planes
  })

});

router.get("/planes/:idPlan/asig", async (req, res) => {
  const { idPlan } = req.params;
  const asigs = await Planes_Det.where(
    { id_plan: [idPlan] },
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

module.exports = router;
