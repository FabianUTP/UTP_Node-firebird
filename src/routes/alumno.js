const express = require("express");
const router = express.Router();

// Middleewares para las sesiones
const { verifySesion } = require("../app/middlewares/session");

// Controladores
const { AlumnosController, HomeController } = require("../app/controllers");

// Rutas de los Alumnos
router.get("/", verifySesion, HomeController.index);
router.get("/boletas", verifySesion, AlumnosController.getBoletas);
router.get("/documentos", verifySesion, (req, res) => {
  res.render("alumno/documentos/doctos-screen");
});
router.get("/contactar", verifySesion, verifySesion, (req, res) =>
  res.render("others/contacto-screen")
);

router.get("/perfil", verifySesion, AlumnosController.showById);
router.post("/perfil/update-contacto", verifySesion, AlumnosController.updateContact);
router.post("/perfil/update-per-contac", verifySesion, AlumnosController.updatePerContact);
router.post("/perfil/update-seguro", verifySesion, AlumnosController.updateSeguro);
// router.post("/perfil/update-beca", verifySesion, AlumnosController.updateBeca);

module.exports = router;
