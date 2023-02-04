const { request, response } = require("express");
const { Alumno } = require("../models");

const AuthController = {};

AuthController.login = (req, res) => res.render("auth/login");

AuthController.postLogin = async (req = request, res = response) => {

  const credential = req.body.matricula;

if(credential === "admin") {
  req.session.isAuthenticated = true;
  req.session.IDAuth = '';
  req.session.nameAuth = 'Admin';
  req.session.lastNameAuth = `Escolar`;
  req.session.isAdmin = true;
} else {
  let alumno = await Alumno.findById(credential);

  if(alumno === null) {
    req.flash('msj_error', 'Usuario no encontrado');
    return res.redirect('/login');
  }

  req.session.isAuthenticated = true;
  req.session.IDAuth = alumno.MATRICULA;
  req.session.nameAuth = alumno.NOMBRE;
  req.session.lastNameAuth = `${alumno.PATERNO} ${alumno.MATERNO}`;
  req.session.isAdmin = false;
}

  res.redirect('/');
};

AuthController.logout = (req = request, res = response) => {
  req.session.destroy();
  res.redirect('/login');
}

AuthController.registro = (req = request, res = response) => {
  res.render('auth/register');
}

module.exports = {
  AuthController,
};
