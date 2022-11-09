const express = require("express");
const router = express.Router();

const {
  Alumno,
  Ciclos,
  Grupos,
  Niveles,
  Doctos,
  AlumnosGrupos,
  Planes_Det,
  AlumKardex,
} = require("../app/models");

router.get("/grupos", async (req, res) => {
  const {
    skip = 0,
    limit = 10,
    search = "",
    orderBy,
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
  if (orderBy) {
    query += `ORDER BY ${orderBy} ${sort}`;
  }

  const grupos = await Grupos.createQuery({ querySql: query });

  res.json({
    querys: req.query,
    periodoSelected: req.session.periodoSelected,
    grupos,
  });
});

router.get("/grupos_alumnos/:idGrupo", async (req, res) => {
  const { limit = 10, skip = 0 } = req.query;
  const idGrupo = req.params.idGrupo;

  let sql = `SELECT FIRST(${limit}) SKIP(${skip}) `;
  sql += `alumnos.matricula, alumnos.paterno, alumnos.materno, alumnos.nombre `;
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

  const alumnos = await AlumnosGrupos.createQuery({ querySql: sql });

  res.json({
    querys: req.query,
    idGrupo,
    alumnos,
  });
});

router.get("/cuatris-navbar", async (req, res) => {
  const ciclos = await Ciclos.where({
    periodo: [1, 2, 3, 4],
  }, { limit: 50 });

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
  });

  res.json({
    ciclos,
  });
});

router.get("/alumnos", async (req, res) => {
  const { limit = 15, skip = 0, search, orderBy = "paterno", sort } = req.query;

  let searchQuery = null;

  // Si hay palabras a buscar, lo agrega en la consulta
  if (search) {
    searchQuery = `(matricula LIKE '%${search}%') `;
    searchQuery += `OR (nombre LIKE '%${search}%') `;
    searchQuery += `OR (paterno LIKE '%${search}%') `;
    searchQuery += `OR (materno LIKE '%${search}%') `;
  }

  const alumnos = await Alumno.all({
    limit,
    skip,
    searchQuery,
    orderBy,
    sort,
  });

  res.json({
    querys: req.query,
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
    querys: req.query,
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
    query: req.query,
    doctos,
  });
});

router.get("/asignaturas", async (req, res) => {
  const { idGrupo, eval } = req.query;

  if(!idGrupo) return res.json([]);

  let grupo = await Grupos.findById(idGrupo);

  let sql = `select first(40) alumnos_kardex.claveasignatura, cfgplanes_det.nombreasignatura
      from alumnos_kardex
      join cfgplanes_det on alumnos_kardex.claveasignatura = cfgplanes_det.claveasignatura
        and alumnos_kardex.id_plan = cfgplanes_det.id_plan
      where alumnos_kardex.inicial = ${grupo.INICIAL}
        and alumnos_kardex.final = ${grupo.FINAL}
        and alumnos_kardex.periodo = ${grupo.PERIODO} 
        and alumnos_kardex.id_eval = '${eval}'`;

  let data = await Grupos.createQuery({ querySql: sql });
  
  res.json({
    querys: req.query,
    data,
  })
});

router.get("/planes", async (req, res) => {
  const { 
    page = 1, 
    search, 
    orderBy = 'nombreasignatura', 
    sort = 'asc' 
  } = req.query;

  let searchQuery = '';

  if (page <= 0) page = 1;

  if (search) {
    searchQuery = `nombreasignatura LIKE '%${search}%'`
  }

  const planes = await Planes_Det.all({
    limit: 20,
    skip: (page - 1) * 20,
    searchQuery,
    orderBy,
    sort,
  });

  res.json({
    query: req.query,
    data: planes
  })

});

router.get("/calificaciones/:numalumno", async (req, res) => {
  const { cuatri, eval = "A" } = req.query;
  const alumno = req.params.numalumno

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
    and (alumnos_kardex.id_eval = '${eval}')`;

  const data = await AlumKardex.createQuery({
    querySql: sql
  })

  res.json({
    query: req.query,
    data
  })

});

module.exports = router;
