const { request, response } = require("express");
const { Alumno } = require("../models/");

const AlumnosController = {};

AlumnosController.showById = async (req = request, res = response) => {
  const alumno = await Alumno.findById(req.session.IDAuth);
  res.render("alumno/perfil/perfil-screen", { alumno });
};

AlumnosController.updateContact = async (req = request, res = response) => {
  const body = {
    domicilio: req.body.domicilio,
    celular: req.body.celular,
    estado: req.body.estado,
    ciudad: req.body.ciudad,
    cp: req.body.cp,
    email: req.body.email,
    email_alterno: req.body.emailutp,
    celular: req.body.telefono_per,
  };

  await Alumno.findByIdAndUpdate(req.session.IDAuth, body);
  res.redirect("/perfil");
};

AlumnosController.updatePerContact = async (req = request, res = response) => {
  const body = {
    contacto: req.body.perContacto,
    PARENTESCO_CONTACTO: req.body.PARENTESCO_CONTACTO,
    TEL_CONTACTO: req.body.telContacto,
  };

  await Alumno.findByIdAndUpdate(req.session.IDAuth, body);
  res.redirect("/perfil");
};

AlumnosController.updateSeguro = async (req = request, res = response) => {
  const body = {
    TIPO_SEG_MED: req.body.TIPO_SEG_MED,
    num_imss: req.body.nss,
  };

  await Alumno.findByIdAndUpdate(req.session.IDAuth, body);
  res.redirect("/perfil");
};

AlumnosController.getBoletas = (req = request, res = response) => {
  let cuatrimestres = [
    "Cuatrimestre 1",
    "Cuatrimestre 2",
    "Cuatrimestre 3",
    "Cuatrimestre 4",
    "Cuatrimestre 5",
  ];

  res.render("alumno/boletas/boletas-screen", {
    cuatrimestres,
  });
};

AlumnosController.doctos = async (req = request, res = response) => {
  const alumno = await Alumno.findById(req.session.IDAuth);

  res.render("alumno/documentos/doctos-screen", {
    numeroalumno: alumno.NUMEROALUMNO,
    nombre: alumno.NOMBRE
  });
}

module.exports = {
  AlumnosController,
};
