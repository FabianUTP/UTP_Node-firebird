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

AlumnosAdminCtr.update = async (req = request, res = response) => {

  const body = req.body;

  const data = {
    fotografia: body?.fotografia,
    paterno: body?.paterno,
    materno: body?.materno,
    nombre: body?.nombre,
    genero: body?.genero,
    fecha_nacimiento: body?.fecha_nacimiento,
    estado_nacimiento: body?.estado_nacimiento,
    lugar_nacimiento: body?.municipio_naci,
    nacionalidad: body?.nacionalidad,
    clave_ciudadana: body?.curp,
    domicilio: body?.domicilio,
    entre_calles: body?.cruzamientos,
    estado: body?.estado,
    cp: body?.postal, 
    email: body?.email_personal,
    email_alterno: body?.email_insti,
    celular: body?.tel_cel,
    telefono: body?.tel_domicilio,
    nivel: body?.nivel,
    grado: body?.grado,
    matricula: body?.matricula,
    observaciones: body?.nota
  }

  await Alumno.findByIdAndUpdate(body?.matricula, data);

  res.redirect(`/alumnos/${body?.matricula}`)
}

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
