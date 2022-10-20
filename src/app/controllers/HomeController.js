const { request, response } = require("express");
const { dash_items } = require("../../utils/dahsboard-items");

const HomeController = {};

HomeController.index = (req = request, res = response) => {
  if (req.session.isAdmin) {
    // Vista a mostrar para el administrador
    res.render("admin/dashboard-admin");
  } else {
    // vista a mostrar para el alumno
    res.render("alumno/dashboard", {
      items: dash_items,
    });
  }
};

module.exports = {
  HomeController,
};
