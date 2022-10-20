const express = require("express");
const router = express.Router();

const {
  Alumno,
  Ciclos,
  Grupos,
  Niveles,
  Doctos,
  AlumnosGrupos,
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
  }, 50);

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
    searchQuery = `codigo_corto LIKE '%${search.toLowerCase()}%'`;
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

router.get("/doctos/admin", async (req, res) => {
  const { nivel, limit = 10, skip } = req.query;

  const doctos = await Doctos.where({
    nivel: [nivel],
  },
    limit,
    skip
  );

  res.json({
    nivel,
    doctos,
  });
});

module.exports = router;
