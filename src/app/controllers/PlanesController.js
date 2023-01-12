const { Planes_Mst } = require("../models");

const PlanesCtr = {};

PlanesCtr.showTable = (req, res) => {
  res.render("admin/academico/planes/planes-list");
};

PlanesCtr.showCreate = (req, res) => {
  res.render("admin/academico/planes/planes-crear");
};

PlanesCtr.showById = async (req, res) => {
  const plan = await Planes_Mst.findById(req.params.id);
  res.render("admin/academico/planes/planes-id", plan);
};

PlanesCtr.update = async (req, res) => {
  res.json({
    body: req.body,
  });
};

PlanesCtr.crear = (req, res) => {
  res.json({
    respuesta: req.body,
  });
};

module.exports = {
  PlanesCtr,
};
