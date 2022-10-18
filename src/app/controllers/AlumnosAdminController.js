const { request, response } = require("express");

const AlumnosAdminCtr = {};

AlumnosAdminCtr.createView = (req, res) => {
  res.render("admin/alumnos/crear-screen");
};

AlumnosAdminCtr.show = (req, res) => {
  res.render("admin/alumnos/lista-screen");
};

AlumnosAdminCtr.showById = (req = request, res = response) => {
  console.log(req.params.id);
  res.render("admin/alumnos/crear-screen");
};

module.exports = {
  AlumnosAdminCtr,
};
