const { request, response } = require("express");

const AuthController = {};

AuthController.login = (req, res) => {
  res.render("auth/login") ;
};

AuthController.postLogin = (req = request, res = response) => {

  const credential = req.body.matricula;

  if(!["admin", "alumno"].includes(credential)) {
    req.flash('error_msj', 'Matricula incorrecta');
    return res.redirect('/login');
  }

  req.session.isAuthenticated = true;
  req.session.nameAuth = 'Fabian';
  req.session.IDAuth = '5465';
  req.session.lastNameAuth = 'Caamal';
  req.session.isAdmin = credential === "admin";

  res.redirect('/');
};

AuthController.logout = (req = request, res = response) => {

  req.session.destroy();
  res.redirect('/login');
}

module.exports = {
  AuthController,
};
