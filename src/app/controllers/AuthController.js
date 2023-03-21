const { request, response } = require("express");
const { Alumno, Profesores, Aspirante, Usuarios } = require("../models");

const AuthController = {};

AuthController.login = (req, res) => res.render("auth/login");

AuthController.authAlumno = async (req = request, res = response) => {
  const { user, password } = req.body;
  
  const alumno = await Alumno.findById(user);

  if(alumno) { 
    // Valida que no sea aspirante
    if (alumno?.STATUS.trim() === "S") {
      req.flash('msj_error', 'No pueden ingresar los aspirantes');
      return res.redirect('/login');
    }
    req.session.isAuthenticated = true;
    req.session.isAlumno = true;
    req.session.IDAuth = alumno.MATRICULA;
    req.session.nameAuth = alumno.NOMBRE;
    req.session.lastNameAuth = `${alumno.PATERNO} ${alumno.MATERNO}`;
    return res.redirect('/');
  } else {
    req.flash('msj_error', 'Alumno no encontrado');
    return res.redirect('/login');
  }

};

AuthController.authAspirante = async (req = request, res = response) => {
  const { user, password } = req.body;

  let aspirante = await Aspirante.findById(user);

  if(aspirante) { 

    if (aspirante?.STATUS.trim() !== "S") {
      req.flash('msj_error', 'Ya no puede ingresar con el folio');
      return res.redirect('/login');
    }

    req.session.isAuthenticated = true;
    req.session.isAspirante = true;
    req.session.IDAuth = aspirante.NUMEROALUMNO;
    req.session.nameAuth = aspirante.NOMBRE;
    req.session.lastNameAuth = aspirante.PATERNO;
    return res.redirect('/');
  } else {
    req.flash('msj_error', 'Folio de aspirante no encontrado');
    return res.redirect('/login');
  }
};

AuthController.authProfe = async (req = request, res = response) => {
  const { user, password } = req.body;

  let profe = await Profesores.findById(user);

  if(profe) { 
    req.session.isAuthenticated = true;
    req.session.isProfe = true;
    req.session.IDAuth = profe.CLAVEPROFESOR;
    req.session.nameAuth = profe.NOMBREPROFESOR;
    req.session.lastNameAuth = "";
    return res.redirect('/');
  } else {
    req.flash('msj_error', 'Folio no encontrado');
    return res.redirect('/login');
  }
};

AuthController.authAdmin = async (req = request, res = response) => {
  const { user, password } = req.body;

  const userData = await Usuarios.findById(user);

  // Valida que exista el usuario
  if(userData) {
    // Valida que sea administrador
    if (userData.ADMINISTRADOR.trim() === "N") {
      req.flash('msj_error', 'El usuario no es administrador');
      return res.redirect('/login');
    }
    req.session.isAuthenticated = true;
    req.session.isAdmin = true;
    req.session.IDAuth = userData.EMAIL;
    req.session.nameAuth = userData.NOMBRE;
    req.session.lastNameAuth = "";
    return res.redirect('/');
  } else {
    req.flash('msj_error', 'Usuario no encontrado');
    return res.redirect('/login');
  }
};

AuthController.logout = (req = request, res = response) => {
  req.session.destroy();
  res.redirect("/login");
};

module.exports = {
  AuthController,
};
