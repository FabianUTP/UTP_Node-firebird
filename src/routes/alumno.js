const express = require("express");
const router = express.Router();

// Controladores
const { AlumnosController, HomeController } = require("../app/controllers");

// Rutas de los Alumnos
router.get("/", HomeController.index);
router.get("/boletas", AlumnosController.getBoletas);
router.get("/documentos", AlumnosController.doctos);

router.get("/perfil", AlumnosController.showById);
router.post("/perfil/update-contacto", AlumnosController.updateContact);
router.post("/perfil/update-per-contac", AlumnosController.updatePerContact);
router.post("/perfil/update-seguro", AlumnosController.updateSeguro);
// router.post("/perfil/update-beca",  AlumnosController.updateBeca);

router.get("/contactar", (req, res) => res.render("others/contacto-screen"));

module.exports = router;
