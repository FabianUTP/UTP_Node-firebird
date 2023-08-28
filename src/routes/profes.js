const express = require("express");
const router = express.Router();
const { isAdmin } = require("../app/middlewares/session");

// Siempre poner este middleware al crear una ruta get
const { isProfesor } = require("../app/middlewares/session");
const profesorGrupoController = require('../app/controllers/profesorGrupoController');
const {ProfGrp} = require("../app/controllers/profesorGrupoController");
const { Profesores } = require("../app/models");


router.get("/datos", isProfesor, (req, res) => res.render("profes/profesores-id"));
router.get("/grupoprofe", ProfGrp.showGrupo);
router.get("/grupoprofe/:id/ver_calif", ProfGrp.showViewCalif);
router.get("/grupoprofe/:id/subir_calif", ProfGrp.showSubirCalif);



module.exports = router;








