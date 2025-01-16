const express = require("express");
const router = express.Router();
const { isProfesor } = require("../middlewares/session")
const { ProfesoresGrupos, Profesores, Planes_Eval } = require("../models")
//cambios de paginas grupos/calificaciones/subircalifaciones
const ProfGrp = {};

ProfGrp.showGrupo = async (req, res) => {
  const idProfesor = req.session.IDAuth;
  const profe = await Profesores.findById(idProfesor);
  res.render("profes/calif/Grupos_ciclos", profe);
};

ProfGrp.showViewCalif = async (req = request, res) => {
  const idProfesor = req.session.IDAuth;
  const { idPlan } = req.query;

  const profe = await Profesores.findById(idProfesor);
  const evals = await Planes_Eval.where(
    { id_plan: [idPlan] },
    { strict: true }
  );
  //ruta para los datos de la nueva tabla.--->
  res.render("profes/calif/Calificaciones", { profe, evals });
};

ProfGrp.showSubirCalif = async (req, res) => {
  const idProfesor = req.session.IDAuth;
  const { idPlan } = req.query;

  const profe = await Profesores.findById(idProfesor);
  const evals = await Planes_Eval.where(
    { id_plan: [idPlan] },
    { strict: true }
  );
  res.render("profes/calif/Subircalifaciones", { profe, evals });
};


module.exports = {
  ProfGrp,
}