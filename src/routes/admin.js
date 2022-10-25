const express = require("express");
const router = express.Router();

// Middleewares para las sesiones
const { isAdmin } = require("../app/middlewares/session");

// Controladores
const {
  GruposCtr,
  CuatrisCtr,
  NivelesCtr,
  AlumnosAdminCtr,
} = require("../app/controllers");

// Middleware solo proteger las rutas y solo pueda acceder el admin
router.use(isAdmin);

// Rutas para el Administrador
router.get("/grupos", GruposCtr.show);
router.get("/grupos/:idGrupo", GruposCtr.showById);
router.get("/nuevo", AlumnosAdminCtr.createView);
router.get("/alumnos", AlumnosAdminCtr.show);
router.get("/alumnos/:id", AlumnosAdminCtr.showById);
router.get("/alumnos/:id/doctos", AlumnosAdminCtr.doctos);

router.get("/cuatrimestres", CuatrisCtr.index);
router.get("/cuatrimestres/nuevo", CuatrisCtr.showCreate);
router.post("/cuatrimestres/nuevo", CuatrisCtr.create);
router.get("/cuatrimestres/:id", CuatrisCtr.showById);
router.post("/cuatrimestres/:id/update", CuatrisCtr.update);
router.post("/cuatrimestres/:id/delete", CuatrisCtr.delete);
router.get("/carreras", NivelesCtr.show);

router.get("/calificaciones/subir", (req, res) => res.render("admin/calificaciones/califi"));
router.get("/calificaciones/subir/:idGrupo", (req, res) => res.render("admin/calificaciones/califi"));

module.exports = router;
