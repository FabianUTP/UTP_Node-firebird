const { Planes_Det } = require("../models");

const PlanesCtr = {};

PlanesCtr.showTable = (req, res) => {
  res.render("admin/academico/planes/planes-list");
};

PlanesCtr.showCreate = (req, res) => {
  res.render("admin/academico/planes/planes-crear");
};

PlanesCtr.showById = async (req, res) => {
  const plan = await Planes_Det.findById(req.params.id);
  res.render("admin/academico/planes/planes-id", plan);
};

PlanesCtr.update = async (req, res) => {

  const data = {
    claveasignatura: req.body.claveasignatura,
    nombreasignatura: req.body.nombreasignatura
  }

  await Planes_Det.findByIdAndUpdate(req.params.id, data);
  res.redirect("admin/academico/planes");
};

PlanesCtr.crear = (req, res) => {
  res.json({
    respuesta: req.body,
  });
};

module.exports = {
  PlanesCtr,
};
