const { request, response } = require("express");
const items = require("../../utils/dashboard-items");

const HomeController = {};

HomeController.index = (req = request, res = response) => {
  const { isAdmin, isAlumno, isProfe, isAspirante } = req.session;

  let itemSelected = [];

  if (isAdmin) {
    itemSelected = items.admin_items;
  }

  if (isAlumno) {
    itemSelected = items.alumno_items;
  }

  if (isProfe) {
    itemSelected = items?.profe_items;
  }

  if (isAspirante) {
    itemSelected = items?.aspirante_items;
  }

  // Vista a mostrar para el administrador
  res.render("dashboard", {
    items: itemSelected,
  });
};

module.exports = {
  HomeController,
};
