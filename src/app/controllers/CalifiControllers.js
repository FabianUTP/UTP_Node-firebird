const { request, response } = require("express");

const CalifiCtr = {};

const path = "admin/academico/calificaciones/";

CalifiCtr.showCalifi = async (req = request, res = response) => {
  const grupoId = req.params.idGrupo;

  res.render(path + "califi", {
    codigo_grupo: grupoId,
  });
};

module.exports = {
  CalifiCtr,
};
