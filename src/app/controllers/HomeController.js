const { request, response } = require("express");
const { admin_items, alumno_items } = require("../../utils/dashboard-items");

const HomeController = {};

HomeController.index = (req = request, res = response) => {
  let isAdmin = req.session.isAdmin;
  // Vista a mostrar para el administrador
  res.render("dashboard", {
    items: isAdmin ? admin_items : alumno_items,
  });
};

module.exports = {
  HomeController,
};
