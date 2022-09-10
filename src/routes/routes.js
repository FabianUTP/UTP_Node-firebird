const express = require("express");
const router = express.Router();

// Middleewares para las sesiones
const { verifySesion, noAuth } = require("../app/controllers/middlewares/");

// Controladores
const {
  AuthController,
  AlumnosController,
  HomeController,
  GruposCtr,
} = require("../app/controllers");

// Login y Autenticaciones
router.get("/login", noAuth, AuthController.login);
router.post("/login", AuthController.postLogin);
router.get("/logout", AuthController.logout);
// router.get("/register", (req, res) => res.render("auth/register"));

// Rutas de los Alumnos
router.get("/", verifySesion, HomeController.show);
router.get("/boletas", verifySesion, AlumnosController.getBoletas);
router.get("/documentos", verifySesion, (req, res) => {
  res.render("alumno/documentos/doctos-screen");
})

router.get("/perfil", verifySesion, AlumnosController.show);
router.post("/perfil/update-contacto", verifySesion, AlumnosController.updateContact);
router.post("/perfil/update-per-contac", verifySesion, AlumnosController.updatePerContact);
// router.post("/perfil/update-beca", verifySesion, AlumnosController.updateBeca);
router.post("/perfil/update-seguro", verifySesion, AlumnosController.updateSeguro);


// Rutas para el Administrador
router.get("/grupos", GruposCtr.show);
router.get("/grupos/:idGrupo", GruposCtr.show);
router.get("/nuevo-alumno", verifySesion, (req, res) => res.render("admin/alumno/crear-screen"));

module.exports = router;
