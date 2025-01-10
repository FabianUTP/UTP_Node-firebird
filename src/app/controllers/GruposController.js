const { Grupos } = require("../models");

const GruposCtr = {};

const path = "admin/alumnos/grupos";

GruposCtr.show = (req, res) => {
  res.render(path + '/grupos-list');
};

GruposCtr.showAnother = (req, res) => {
  res.render(path + '/grupos-list-califi');
};

GruposCtr.showByIdAnother = async (req, res) => {
  const grupo = await Grupos.findById(req.params.idGrupo);
  res.render(path + '/grupo-detail-califi', {
    codigo_grupo: req.params.idGrupo,
    grupo
  })
};

GruposCtr.showById = async (req, res) => {
  const grupo = await Grupos.findById(req.params.idGrupo);
  res.render(path + '/grupo-detail', {
    codigo_grupo: req.params.idGrupo,
    grupo
  })
};




GruposCtr.addView = (req, res) => {
  res.render(path + "/grupo-add")
}

GruposCtr.editView = async (req, res) => {
  const grupo = await Grupos.findById(req.params.idGrupo);
  res.render(path + "/grupo-edit", grupo);
}

GruposCtr.addAlumnoView = (req, res) => {
  res.render(path + "/grupo-edit-alumno")
}

module.exports = {
  GruposCtr
};