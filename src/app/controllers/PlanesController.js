const { Planes_Mst, Planes_Det, Planes_Eval } = require("../models");

const PlanesCtr = {};

// <====== Plan de estudios (cfgplanes_mst) =======>
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

PlanesCtr.updatePlan = async (req, res) => {
  res.json({
    body: req.body,
  });
};

PlanesCtr.crearPlan = (req, res) => {
  res.json({
    respuesta: req.body,
  });
};

// <====== Evaluaciones del Plan (cfgplanes_eval) =======>
PlanesCtr.showEval = async (req, res) => {
  const { idPlan } = req.params;
  res.render("admin/academico/planes/eval/planes-eval-list", { idPlan });
};

PlanesCtr.showPlanesEvalId = async (req, res) => {
  res.render("admin/academico/planes/eval/planes-eval-id");
};

PlanesCtr.showCreatePlanesEval = (req, res) => {
  res.render("admin/academico/planes/eval/planes-eval-create");
};

// <====== Asignaturas del Plan (cfgplanes_det) =======>
PlanesCtr.showAsignaturas = async (req, res) => {
  const { idPlan } = req.params;
  res.render("admin/academico/planes/asig/planes-asig-list", { idPlan });
};

PlanesCtr.showPlanesAsigId = async (req, res) => {
  const { idPlan, idAsig } = req.params;

  const [asig] = await Planes_Det.where(
    {
      id_plan: [idPlan],
      claveasignatura: [idAsig],
    },
    { limit: 1 }
  );

  res.render("admin/academico/planes/asig/planes-asig-id", asig);
};

PlanesCtr.showCreatePlanesAsig = (req, res) => {
  res.render("admin/academico/planes/asig/planes-asig-create");
};

module.exports = {
  PlanesCtr,
};
