const { Profesores } = require("../models");

const ProfeCtr = {};

ProfeCtr.showList = (req, res) => {
  res.render("admin/profes/profesores-list");
};

ProfeCtr.showById = async (req, res) => {
  const { id } = req.params;
  const profe = await Profesores.findById(id);
  res.render("admin/profes/profesores-id", profe);
};

ProfeCtr.update = async (req, res) => {
  const id = req.params.id;
  const data = {
    nombreprofesor: req.body.nombre,
    genero: req.body.genero,
    cedula_fiscal: req.body.cedula,
    clave_ciudadana: req.body.clave_ciudadana,
    estado_civil: req.body.estado_civil,
    fecha_nacimiento: req.body.nacimiento,
    lugar_nacimiento: req.body.lugar_nacimiento,
    estado_nacimiento: req.body.estado_nacimiento,
    nacionalidad: req.body.nacionalidad,
    domicilio: req.body.domicilio,
    cp: req.body.cp,
    ciudad: req.body.ciudad,
    estado: req.body.estado,
    telefono: req.body.telefono,
  };

  await Profesores.findByIdAndUpdate(id, data);
  
  res.json({
    id, data
  })
  // res.redirect("/profesores");

};
ProfeCtr.showAsig = (req, res) => {
  res.render("admin/profes/asig/profes-asig-id");
};

ProfeCtr.showPerfil = (req, res) => {
  res.render("admin/profes/asig/profes-perfil");
};

module.exports = {
  ProfeCtr,
};
