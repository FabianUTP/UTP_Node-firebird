const { request, response } = require("express");

const AuthController = {};

AuthController.login = (req, res) => {
  res.render("auth/login");
};

AuthController.postLogin = (req = request, res = response) => {

  req.session.name = "fabian caamal";
  res.redirect('/');
};

AuthController.logout = (req = request, res = response) => {

  req.session.destroy();
  res.redirect('/login');
}

module.exports = {
  AuthController,
};
