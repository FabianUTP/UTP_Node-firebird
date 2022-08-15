const { request, response } = require("express");
const Alumno = require("../models/Alumno");

const AlumnosController = {};

AlumnosController.show = async (req = request, res = response) => {

  // const [alumno] = await Alumno.findById("1921");
  res.render("alumno/perfil/perfil-screen");
};

AlumnosController.update = async (req = request, res = response) => {
  const body = {
    email: req.body.email,
    celular: req.body.celular,
  };

  await Alumno.findByIdAndUpdate("1921", body);
  res.redirect("/perfil");
};

AlumnosController.getBoletas = (req = request, res = response) => {

  let cuatrimestres = [
    'Cuatrimestre 1',
    'Cuatrimestre 2',
    'Cuatrimestre 3',
    'Cuatrimestre 4',
    'Cuatrimestre 5',
  ]

  res.render('alumno/boletas/boletas-screen', {
    cuatrimestres,
  });
}

module.exports = {
  AlumnosController,
};
