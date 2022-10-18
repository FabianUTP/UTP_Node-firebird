const express = require("express");
const router = express.Router();

// Middleewares para las sesiones
const { verifySesion, noAuth } = require("../app/middlewares/session");

// Controladores
const { AuthController } = require("../app/controllers");

// Login y Autenticaciones
router.get("/login", noAuth, AuthController.login);
router.post("/login", AuthController.postLogin);
router.get("/logout", AuthController.logout);

// Middleware para que se inicie sesion
router.use(verifySesion);

// Rutas del alumno
router.use(require('./alumno'));

// Rutas del administrador
router.use(require('./admin'));

// Para la ruta de 404 - Page not found
router.get("*", (req, res) => res.status(404).render("others/error404"));

module.exports = router;
