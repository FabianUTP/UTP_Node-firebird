const { request, response } = require("express");
const { Alumno } = require("../models");

const AlumnosAdminCtr = {};

AlumnosAdminCtr.createView = (req, res) => {
  res.render("admin/alumnos/alumnos/alumnos-crear");
};

AlumnosAdminCtr.show = (req, res) => {
  res.render("admin/alumnos/alumnos/alumnos-lista");
};

AlumnosAdminCtr.showById = async (req = request, res = response) => {
  const alumno = await Alumno.findById(req.params.id);
  res.render("admin/alumnos/alumnos/alumno-id", alumno);
};

AlumnosAdminCtr.doctos = async (req = request, res = response) => {
  const alumno = await Alumno.findById(req.params.id);
  res.render("alumno/documentos/doctos-screen", {
    numeroalumno: alumno?.NUMEROALUMNO,
    nombre: alumno?.NOMBRE
  });
};

AlumnosAdminCtr.boletas = async (req, res) => {
  const alumno = await Alumno.findById(req.params.id);
  res.render("alumno/boletas/boletas-screen", alumno);
}

module.exports = {
  AlumnosAdminCtr,
};
