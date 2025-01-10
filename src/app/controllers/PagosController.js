const { Pagosalum } = require("../models");

const PagosController = {};

const path = "alumno/reinscripcion/pagos";

PagosController.show = (req, res) => {
  res.render(path + '/pagos');
};

PagosController.showById = async (req, res) => {
  const grupo = await Grupos.findById(req.params.idGrupo);
  res.render('alumno/reinscripcion/pago', {
    codigo_plan: req.params.idGrupo,
    grupo
  })
};


  module.exports = {
    PagosController,
  };
  