const { request, response } = require("express");
const Alumno = require("../models/Alumno");

const AuthController = {};

AuthController.login = (req, res) => {
  res.render("auth/login") ;
};

AuthController.postLogin = async (req = request, res = response) => {

  const credential = req.body.matricula;

  let alumno = await Alumno.findById(credential)

  if(alumno === null) {
    req.flash('error_msj', 'Matricula incorrecta');
    return res.redirect('/login');
  }

  req.session.isAuthenticated = true;
  req.session.IDAuth = alumno.MATRICULA;
  req.session.nameAuth = alumno.NOMBRE;
  req.session.lastNameAuth = `${alumno.PATERNO} ${alumno.MATERNO}`;
  req.session.isAdmin = true;

  res.redirect('/');
};

AuthController.logout = (req = request, res = response) => {

  req.session.destroy();
  res.redirect('/login');
}

module.exports = {
  AuthController,
};
