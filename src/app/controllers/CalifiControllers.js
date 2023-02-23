const { request, response } = require("express");
const { Grupos, Planes_Mst } = require("../models");

const CalifiCtr = {};

const path = "admin/academico/calificaciones/";

CalifiCtr.showCalifi = async (req = request, res = response) => {
  const codigo_grupo = req.params.idGrupo;

  const grupo = await Grupos.findById(codigo_grupo);

  const planes = await Planes_Mst.where({
    nivel: [grupo?.NIVEL]
  }, { limit: 10 });

  res.render(path + "califi", {
    codigo_grupo,
    planes,
  });
};

module.exports = {
  CalifiCtr,
};
