const express = require("express");
const router = express.Router();

// Middleewares para las sesiones
const { isAdmin } = require("../app/middlewares/session");

// Controladores
const {
  GruposCtr,
  CuatrisCtr,
  NivelesCtr,
  FichasCtr,
  AlumnosAdminCtr,
} = require("../app/controllers");

// Middleware solo proteger las rutas y solo pueda acceder el admin
router.use(isAdmin);

// Rutas para el Administrador
router.get("/grupos", GruposCtr.show);
router.get("/grupos/:idGrupo", GruposCtr.show);
router.get("/nuevo", AlumnosAdminCtr.createView);
router.get("/alumnos", AlumnosAdminCtr.show);
router.get("/alumnos/:id", AlumnosAdminCtr.show);

router.get("/cuatrimestres", CuatrisCtr.index);
router.get("/cuatrimestres-nuevo", CuatrisCtr.showCreate);
router.post("/cuatrimestres/nuevo", CuatrisCtr.create);
router.get("/cuatrimestres/:id", CuatrisCtr.showById);
router.get("/carreras", NivelesCtr.show);

router.get("/calificaciones", (req, res) => res.render("admin/califi"));
router.get("/doctos", FichasCtr.doctos);

module.exports = router;
