const express = require("express");
const router = express.Router();

// Siempre poner este middleware al crear una ruta get
const { isAlumno } = require("../app/middlewares/session");

// Controladores
const { AlumnosController } = require("../app/controllers");

// Rutas de los Alumnos
router.get("/boletas", isAlumno, AlumnosController.getBoletas);
router.get("/doctos", isAlumno, AlumnosController.doctos);
router.get("/doctos/:idDocto", AlumnosController.showDocto);

router.get("/perfil", isAlumno, AlumnosController.showById);
router.post("/perfil/update-contacto", AlumnosController.updateContact);
router.post("/perfil/update-per-contac", AlumnosController.updatePerContact);
router.post("/perfil/update-seguro", AlumnosController.updateSeguro);
// router.post("/perfil/update-beca",  AlumnosController.updateBeca);

router.get("/contactar", (req, res) => res.render("others/contacto-screen"));

module.exports = router;
