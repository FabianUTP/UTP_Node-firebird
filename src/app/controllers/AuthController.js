const { request, response } = require("express");
const { Alumno, Profesores, Aspirante } = require("../models");

const AuthController = {};

AuthController.login = (req, res) => res.render("auth/login");

AuthController.authAlumno = async (req = request, res = response) => {
  const { user, password } = req.body;
  
  const alumno = await Alumno.findById(user);

  if(alumno) { 
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

    if (aspirante?.nose === "A") {
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

  if(user === "admin") { 
    req.session.isAuthenticated = true;
    req.session.isAdmin = true;
    req.session.IDAuth = "";
    req.session.nameAuth = "Administrador";
    req.session.lastNameAuth = "Escolar";
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
