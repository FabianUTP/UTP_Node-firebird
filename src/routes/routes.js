const express = require("express");
const router = express.Router();

// Middleewares para las sesiones
const { verifySesion } = require("../app/controllers/middlewares/session");

// Controladores
const {
  AlumnosController,
  HomeController,
  AuthController,
} = require("../app/controllers");

// Autenticaciones
router.get("/login", AuthController.login);
router.post("/login", AuthController.postLogin);
router.get("/logout", AuthController.logout);
router.get("/register", (req, res) => res.render("auth/register"));

// Alumnos
router.get("/", verifySesion, HomeController.show);
router.get("/perfil", verifySesion, AlumnosController.show);
router.post("/perfil", verifySesion, AlumnosController.update);

module.exports = router;
