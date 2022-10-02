const express = require("express");
const router = express.Router();

// Middleewares para las sesiones
const { 
  verifySesion,
  isAdmin,
  noAuth
} = require("../app/middlewares/session");

// Controladores
const {
  AuthController,
  AlumnosController,
  HomeController,
  GruposCtr,
  CuatrisCtr,
} = require("../app/controllers");

// Login y Autenticaciones
router.get("/login", noAuth, AuthController.login);
router.post("/login", AuthController.postLogin);
router.get("/logout", AuthController.logout);
// router.get("/register", (req, res) => res.render("auth/register"));

// Rutas de los Alumnos
router.get("/", verifySesion, HomeController.index);
router.get("/boletas", verifySesion, AlumnosController.getBoletas);
router.get("/documentos", verifySesion, (req, res) => {
  res.render("alumno/documentos/doctos-screen");
});
router.get("/contactar", verifySesion, verifySesion, (req, res) => res.render("others/contacto-screen"));

router.get("/perfil", verifySesion, AlumnosController.showById);
router.post("/perfil/update-contacto", verifySesion, AlumnosController.updateContact);
router.post("/perfil/update-per-contac", verifySesion, AlumnosController.updatePerContact);
router.post("/perfil/update-seguro", verifySesion, AlumnosController.updateSeguro);
// router.post("/perfil/update-beca", verifySesion, AlumnosController.updateBeca);


// Rutas para el Administrador
router.get("/grupos", [isAdmin, verifySesion], GruposCtr.show);
router.get("/grupos/:idGrupo", [isAdmin, verifySesion], GruposCtr.show);
router.get("/nuevo", [isAdmin, verifySesion], verifySesion, (req, res) => res.render("admin/alumnos/crear-screen"));
router.get('/alumnos', [isAdmin, verifySesion], (req, res) => res.render("admin/alumnos/lista-screen"));
router.get('/cuatrimestres', [isAdmin, verifySesion], CuatrisCtr.index);
router.get('/cuatrimestres-nuevo', [isAdmin, verifySesion], CuatrisCtr.showCreate);
router.post('/cuatrimestres/nuevo', [isAdmin, verifySesion], CuatrisCtr.create);
router.get('/cuatrimestres/:id', [isAdmin, verifySesion], CuatrisCtr.showById);

module.exports = router;
