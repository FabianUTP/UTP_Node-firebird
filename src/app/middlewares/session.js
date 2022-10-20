const { request, response } = require("express");

const verifySesion = (req = request, res = response, next) => {
    if(req.session.isAuthenticated) {
        next();
    } else {
        res.redirect('/login');
    }
}

const noAuth = (req = request, res = response, next) => {
    if(req.session.isAuthenticated) {
        res.redirect('/');
    } else {
        next();
    }
}

const isAdmin = (req = request, res = response, next) => {
    if(req.session.isAdmin) {
        next();
    } else {
        res.redirect('/');
    }
}

const isAlumno = (req = request, res = response, next) => {
    if(req.session.isAdmin) {
        res.redirect('/');
    } else {
        next();
    }
}

module.exports = {
    verifySesion,
    noAuth,
    isAdmin,
    isAlumno,
}