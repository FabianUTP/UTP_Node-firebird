const { request, response } = require("express");

/**
 * Verifica que se haya iniciado sesion para acceder
 */
const verifySesion = (req = request, res = response, next) => {
    if(req.session.isAuthenticated) {
        next();
    } else {
        res.redirect('/login');
    }
}

/**
 * Deniega el acceso a los que tienen iniciado sesion
 */
const noAuth = (req = request, res = response, next) => {
    if(req.session.isAuthenticated) {
        res.redirect('/');
    } else {
        next();
    }
}


/**
 * Verifica que sea alumno para acceder
 */
const isAdmin = (req = request, res = response, next) => {
    if(req.session.isAdmin) {
        next();
    } else {
        res.redirect('/');
    }
}

/**
 * Verifica que sea administrador para acceder
 */
const isAlumno = (req = request, res = response, next) => {
    if(req.session.isAdmin) {
        res.redirect('/');
    } else {
        next();
    }
}

/**
 * Se puede acceder sin iniciar sesion
 */
const test = (req = request, res = response, next) => {
    next();
}

module.exports = {
    verifySesion,
    noAuth,
    isAdmin,
    isAlumno,
    test,
}