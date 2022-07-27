const { request, response } = require("express");
const Alumno = require("../models/Alumno");

const AlumnosController = {};

AlumnosController.show = async (req = request, res = response) => {

  const [alumno] = await Alumno.findById("1921");
  res.render("perfil/perfil-screen", alumno);
};

AlumnosController.update = async (req = request, res = response) => {
  const body = {
    email: req.body.email,
    celular: req.body.celular,
  };

  await Alumno.findByIdAndUpdate("1921", body);

  res.redirect("/perfil");
};

module.exports = {
  AlumnosController,
};
