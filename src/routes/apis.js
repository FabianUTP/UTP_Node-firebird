const express = require("express");
const router = express.Router();

const { Alumno, Ciclos, Grupos, Niveles } = require("../app/models");

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
  let periodo = await Ciclos.findById(req.session.periodoSelected);
  if (periodo !== null) {
    // Valida si ya tiene la consulta WHERE
    // si lo tiene agrega un AND,  si no, agrega el WHERE
    query += query.includes("WHERE") ? "AND" : "WHERE";

    query += ` grupos.inicial = ${periodo?.INICIAL} `;
    query += `AND grupos.final = ${periodo?.FINAL} `;
    query += `AND grupos.periodo = ${periodo?.PERIODO} `;
  }

  // Codigo para ordenar si existe
  if (orderBy) {
    query += `ORDER BY ${orderBy} ${sort}`;
  }

  const grupos = await Grupos.createQuery(query);

  res.json({
    querys: req.query,
    periodoSelected: req.session.periodoSelected,
    grupos,
  });
});

router.get("/cuatris-navbar", async (req, res) => {
  const ciclos = await Ciclos.where({
    periodo: [1, 2, 3, 4],
  });

  let periodoSelected = await Ciclos.findById(req.session.periodoSelected);

  res.json({
    periodoSelected: periodoSelected?.DESCRIPCION,
    ciclos,
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

module.exports = router;
