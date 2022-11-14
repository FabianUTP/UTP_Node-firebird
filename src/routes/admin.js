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
  CalifiCtr,
} = require("../app/controllers");

// Middleware para proteger las rutas y solo pueda acceder el admin
router.use(isAdmin);

// Rutas para el Administrador
router.get("/grupos", GruposCtr.show);
router.get("/grupos/:idGrupo", GruposCtr.showById);
router.get("/nuevo", AlumnosAdminCtr.createView);
router.get("/alumnos", AlumnosAdminCtr.show);
router.get("/alumnos/:id", AlumnosAdminCtr.showById);
router.post("/alumnos/:id/update", AlumnosAdminCtr.update);
router.get("/alumnos/:id/doctos", AlumnosAdminCtr.doctos);
router.get("/alumnos/:id/boletas", AlumnosAdminCtr.boletas);

router.get("/cuatrimestres", CuatrisCtr.index);
router.get("/cuatrimestres/nuevo", CuatrisCtr.showCreate);
router.post("/cuatrimestres/nuevo", CuatrisCtr.create);
router.get("/cuatrimestres/:id", CuatrisCtr.showById);
router.post("/cuatrimestres/:id/update", CuatrisCtr.update);
router.post("/cuatrimestres/:id/delete", CuatrisCtr.delete);

router.get("/calificaciones/subir", GruposCtr.show);
router.get("/calificaciones/subir/:idGrupo", CalifiCtr.show);

router.get("/carreras", NivelesCtr.show);
router.get("/carreras/crear", NivelesCtr.form);

router.get("/academico/planes", (req, res) => {
  res.render("admin/academico/planes/planes-list");
});


module.exports = router;