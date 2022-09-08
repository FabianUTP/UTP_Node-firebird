const { request, response } = require("express");
const Grupos = require("../models/Grupos");

const GruposCtr = {};

GruposCtr.show = async (req = request, res = response) => {
  let grupos = await Grupos.all(25);
  res.render('admin/grupos/grupos-screen', {
    grupos
  });
}

module.exports = GruposCtr;