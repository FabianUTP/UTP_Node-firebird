const { request, response } = require("express");

const AuthController = {};

AuthController.login = (req, res) => {
  res.render("auth/login") ;
};

AuthController.postLogin = (req = request, res = response) => {

  if(req.body.matricula !== "5465") {
    req.flash('error_msj', 'Matricula incorrecta');
    return res.redirect('/login');
  }

  req.session.isAuth = true;
  req.session.userAuth = 'Fabian';
  req.session.userIdAuth = '5465';

  res.redirect('/');
};

AuthController.logout = (req = request, res = response) => {

  req.session.destroy();
  res.redirect('/login');
}

module.exports = {
  AuthController,
};
