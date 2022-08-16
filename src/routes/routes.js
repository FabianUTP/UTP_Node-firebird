const express = require("express");
const router = express.Router();

// Middleewares para las sesiones
const { verifySesion, noAuth } = require("../app/controllers/middlewares/");

// Controladores
const {
  AlumnosController,
  HomeController,
  AuthController,
} = require("../app/controllers");

// Para la ruta de 404 - Page not found

// Login y Autenticaciones
router.get("/login", noAuth, AuthController.login);
router.post("/login", AuthController.postLogin);
router.get("/logout", AuthController.logout);
// router.get("/register", (req, res) => res.render("auth/register"));

// Rutas de los Alumnos
router.get("/", verifySesion, HomeController.show);
router.get("/boletas", verifySesion, AlumnosController.getBoletas);
router.get("/perfil", verifySesion, AlumnosController.show);
router.post("/perfil", verifySesion, AlumnosController.update);

router.get("*", (req, res) => res.status(404).render("error404"));

module.exports = router;
