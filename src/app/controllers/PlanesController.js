const { Planes_Mst, Planes_Det, Planes_Eval, Niveles } = require("../models");

const PlanesCtr = {};

// <====== Plan de estudios (cfgplanes_mst) =======>
PlanesCtr.showTable = (req, res) => {
  res.render("admin/academico/planes/planes-list");
};

PlanesCtr.showCreate = async (req, res) => {
  const niveles = await Niveles.all({ limit: 30 });
  res.render("admin/academico/planes/planes-crear", { niveles });
};

PlanesCtr.showById = async (req, res) => {
  const plan = await Planes_Mst.findById(req.params.id);
  let niveles = await Niveles.all({ limit: 30 });
  res.render("admin/academico/planes/planes-id", {plan, niveles});
};

PlanesCtr.updatePlan = async (req, res) => {
  const idPlan = req.params.id;
  const body = {
    nombre_plan: req.body.nombre,
    nivel: req.body.id_nivel,
    maximo: req.body.calif_max,
    minimo: req.body.calif_min,
    MINIMO_APROBATORIO: req.body.min_aprobatoria,
  }

  await Planes_Mst.findByIdAndUpdate(idPlan, body);
  res.redirect("/academico/planes");
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
