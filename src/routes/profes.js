const express = require("express");
const router = express.Router();
const {
    GruposCtr,
    CuatrisCtr,
    NivelesCtr,
    AlumnosAdminCtr,
    CalifiCtr,
    PlanesCtr,
    ProfeCtr,
  
  } = require("../app/controllers");
  

// Importar middlewares y controladores
const { isProfesor } = require("../app/middlewares/session");
const profesorGrupoController = require('../app/controllers/profesorGrupoController');
const { ProfGrp } = require("../app/controllers/profesorGrupoController");

// Definir rutas con sus controladores y middlewares
router.get("/profesores/:id", ProfeCtr.showById);
router.get("/datos", isProfesor, (req, res) => res.render("profes/profesores-id"));
router.get("/grupoprofe", ProfGrp.showGrupo);
router.get("/grupoprofe/:id/ver_calif", ProfGrp.showViewCalif);
router.get("/grupoprofe/:id/subir_calif", ProfGrp.showSubirCalif);

module.exports = router;








