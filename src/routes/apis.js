const { request, response, Router, query } = require("express");
const Grupos = require("../app/models/Grupos");

const router = Router();

router.get("/grupos", async (req = request, res = response) => {
  const { skip = 0, limit = 10, search = '' } = req.query;

  let query = "";
  query += `SELECT FIRST(${limit}) SKIP(${skip}) `;
  query += "grupos.codigo_grupo, grupos.grado, grupos.grupo, grupos.cupo_maximo, grupos.inscritos, profesores.nombreprofesor as claveprofesor_titular, cfgniveles.nivel "
  query += "FROM grupos JOIN profesores "
  query += "ON grupos.claveprofesor_titular = profesores.claveprofesor "
  query += "JOIN cfgniveles "
  query += "on grupos.nivel = cfgniveles.nivel "
  
  if(search.length > 0) {
    query += `WHERE grupos.codigo_grupo LIKE '%${search.toLocaleUpperCase()}%'`
  }

  const grupos = await Grupos.createQuery({ query })

  res.json({
    query: req.query,
    grupos: grupos,
  });
});

router.get("/cuatrimestre", async (req = request, res = response) => {
  res.json({
    msj: 'Hello'
  });
});

module.exports = router;
