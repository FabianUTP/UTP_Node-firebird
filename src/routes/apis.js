const express = require("express");
const router = express.Router();

const { 
  Alumno, 
  Ciclos, 
  Grupos,
  Niveles
} = require('../app/models')

router.get("/grupos", async (req, res) => {
  const { skip = 0, limit = 10, search = "" } = req.query;

  // Consulta SQL paar mostrar los grupos
  let query = `SELECT FIRST(${limit}) SKIP(${skip}) `;
  query +=
    "grupos.codigo_grupo, grupos.grado, grupos.grupo, grupos.cupo_maximo, grupos.inscritos, profesores.nombreprofesor as claveprofesor_titular, cfgniveles.nivel, ciclos.codigo_corto as periodo ";
  query += "FROM grupos ";
  query +=
    "JOIN profesores ON grupos.claveprofesor_titular = profesores.claveprofesor ";
  query += "JOIN cfgniveles ON grupos.nivel = cfgniveles.nivel ";
  query += "JOIN ciclos ON grupos.periodo = ciclos.periodo ";

  // Si hay palabras a bsucar, lo agrega en la consulta
  if (search.length > 0) {
    query += `WHERE (grupos.codigo_grupo LIKE '%${search.toLocaleUpperCase()}%') `;
  }

  // Si hay periodo seleecionado a mostrar lo agrega en la query
  if (req.session.periodoGrupoName) {
    query += `AND (ciclos.descripcion = '${req.session.periodoGrupoName}')`;
  }

  const grupos = await Grupos.createQuery(query);

  res.json({
    querys: {
      skip,
      limit,
      search,
    },
    periodo: req.session.periodoGrupo,
    grupos,
  });
});

router.get("/cuatris-navbar", async (req, res) => {

  const ciclos = await Ciclos.where({
    periodo: [1, 2, 3, 4],
  })

  res.json({
    periodoSelected: req.session.periodoGrupoName,
    ciclos,
  });
});

router.get("/cuatrimestres", async (req, res) => {
  const { limit, skip, search } = req.query;

  let searchQuery = "";

  if (search) {
    searchQuery = `codigo_corto LIKE '%${search.toLowerCase()}%'`
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

router.put("/update/CuatriXGrupos", async (req, res) => {
  const { periodo } = req.body;

  // Actualiza el periodo a mostrar en la API de grupos
  if (periodo === "none") {
    req.session.periodoGrupoName = null;
  } else {
    req.session.periodoGrupoName = periodo;
  }

  res.json({
    res: "Periodo actualizado",
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
  };

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

  if(search) {
    searchQuery = `descripcion LIKE '%${search}%'`
  };

  const niveles = await Niveles.all({
    limit,
    skip,
    searchQuery,
    orderBy: "descripcion"
  });

  res.json({
    querys: req.query,
    niveles,
  });
});

module.exports = router;
