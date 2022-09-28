const { response, request } = require("express");
const CuatrisCtr = {};

CuatrisCtr.index = (req = request, res = response) => {
  res.render("admin/cuatrimestres/cuatris-screen");
};

CuatrisCtr.create = (req = request, res = response) => {
  res.render("admin/cuatrimestres/add-cuatri-screen");
}

module.exports = {
  CuatrisCtr,
}