const { request, response } = require("express");
const { Alumno } = require("../models");

const AlumnosAdminCtr = {};

AlumnosAdminCtr.createView = (req, res) => {
  res.render("admin/alumnos/crear-screen");
};

AlumnosAdminCtr.show = (req, res) => {
  res.render("admin/alumnos/lista-screen");
};

AlumnosAdminCtr.showById = async (req = request, res = response) => {
  const alumno = await Alumno.findById(req.params.id);
  res.render("admin/alumnos/alumno-id-screen", alumno);
};

AlumnosAdminCtr.doctos = async (req = request, res = response) => {
  const alumno = await Alumno.findById(req.params.id);
  res.render("alumno/documentos/doctos-screen", {
    numeroalumno: alumno.NUMEROALUMNO
  });
};

module.exports = {
  AlumnosAdminCtr,
};
