const { request, response } = require("express");

// La información de las autenticaciones están en globals.js

/**
 * Verifica que se haya iniciado sesión para acceder
 */
const verifySesion = (req = request, res = response, next) => {
  if (req.session.isAuthenticated) {
    next();
  } else {
    res.redirect("/login");
  }
};

/**
 * Deniega el acceso a los que tienen iniciado sesión
 */
const noAuth = (req = request, res = response, next) => {
  if (req.session.isAuthenticated) {
    res.redirect("/");
  } else {
    next();
  }
};

/**
 * Verifica que sea alumno para acceder
 */
const isAdmin = (req = request, res = response, next) => {
  if (req.session.isAdmin) {
    next();
  } else {
    res.redirect("/");
  }
};

/**
 * Verifica que sea profesor para acceder
 */
const isProfesor = (req = request, res = response, next) => {
  if (req.session.isProfe) {
    next();
  } else {
    res.redirect("/");
  }
};

const isAlumno = (req = request, res = response, next) => {
  if (req.session.isAlumno) {
    next();
  } else {
    res.redirect("/");
  }
};

const isAspirante = (req = request, res = response, next) => {
  if (req.session.isAspirante) {
    next();
  } else {
    res.redirect("/");
  }
};

/**
 * Se puede acceder sin iniciar sesión
 */
const test = (req = request, res = response, next) => {
  next();
};

module.exports = {
  verifySesion,
  noAuth,
  isAdmin,
  isAlumno,
  isAspirante,
  isProfesor,
  test,
};
