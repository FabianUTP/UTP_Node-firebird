const { request, response } = require("express");
const { Alumno, ProfeAuth, Aspirante, Usuarios } = require("../models");

const AuthController = {};

// Renderiza la vista de login
AuthController.login = (req, res) => res.render("auth/login");

// Autenticación de alumnos
AuthController.authAlumno = async (req = request, res = response) => {
  const { user, password } = req.body;

  try {
    const alumno = await Alumno.findById(user);

    if (!alumno) {
      req.flash('msj_error', 'Alumno no encontrado');
      return res.redirect('/login');
    }

    if (alumno.STATUS.trim() === "S") {
      req.flash('msj_error', 'No pueden ingresar los aspirantes');
      return res.redirect('/login');
    }

    req.session.isAuthenticated = true;
    req.session.isAlumno = true;
    req.session.IDAuth = alumno.MATRICULA;
    req.session.nameAuth = alumno.NOMBRE;
    req.session.lastNameAuth = `${alumno.PATERNO} ${alumno.MATERNO}`;

    return res.redirect('/');
  } catch (error) {
    console.error('Error en authAlumno:', error);
    req.flash('msj_error', 'Hubo un problema al procesar su solicitud');
    return res.redirect('/login');
  }
};

// Autenticación de aspirantes
AuthController.authAspirante = async (req = request, res = response) => {
  const { user, password } = req.body;

  try {
    const aspirante = await Aspirante.findById(user);

    if (!aspirante) {
      req.flash('msj_error', 'Folio de aspirante no encontrado');
      return res.redirect('/login');
    }

    if (aspirante.STATUS.trim() !== "S") {
      req.flash('msj_error', 'Ya no puede ingresar con el folio');
      return res.redirect('/login');
    }

    req.session.isAuthenticated = true;
    req.session.isAspirante = true;
    req.session.IDAuth = aspirante.NUMEROALUMNO;
    req.session.nameAuth = aspirante.NOMBRE;
    req.session.lastNameAuth = aspirante.PATERNO;

    return res.redirect('/');
  } catch (error) {
    console.error('Error en authAspirante:', error);
    req.flash('msj_error', 'Hubo un problema al procesar su solicitud');
    return res.redirect('/login');
  }
};

// Autenticación de profesores
AuthController.authProfe = async (req = request, res = response) => {
  const { user } = req.body;

  try {
    if (!user) {
      req.flash('msj_error', 'Debe proporcionar un usuario');
      return res.redirect('/login');
    }

    const profe = await ProfeAuth.findById(user);
    console.log('Resultado de la consulta:', profe);

    if (!profe) {
      req.flash('msj_error', 'Correo o contraseña incorrectos');
      return res.redirect('/login');
    }

    req.session.isAuthenticated = true;
    req.session.isProfe = true;
    req.session.IDAuth = profe.CLAVEPROFESOR;
    req.session.nameAuth = profe.NOMBREPROFESOR;
    req.session.lastNameAuth = "";

    return res.redirect('/');
  } catch (error) {
    console.error('Error en authProfe:', error);
    req.flash('msj_error', 'Hubo un problema al procesar su solicitud');
    return res.redirect('/login');
  }
};

// Autenticación de administradores
AuthController.authAdmin = async (req = request, res = response) => {
  const { user, password } = req.body;

  try {
    const userData = await Usuarios.findById(user);

    if (!userData) {
      req.flash('msj_error', 'Usuario no encontrado');
      return res.redirect('/login');
    }

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
  } catch (error) {
    console.error('Error en authAdmin:', error);
    req.flash('msj_error', 'Hubo un problema al procesar su solicitud');
    return res.redirect('/login');
  }
};

// Cerrar sesión
AuthController.logout = (req = request, res = response) => {
  req.session.destroy();
  res.redirect("/login");
};

module.exports = {
  AuthController,
};
