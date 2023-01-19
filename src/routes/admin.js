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
  PlanesCtr,
} = require("../app/controllers");

// Middleware para proteger las rutas y solo pueda acceder el admin
router.use(isAdmin);

// Rutas para el Administrador
router.get("/grupos", GruposCtr.show);
router.get("/grupos/crear", GruposCtr.addView);
router.get("/grupos/:idGrupo", GruposCtr.showById);
router.get("/grupos/:idGrupo/editar", GruposCtr.editView);
router.get("/grupos/:idGrupo/agregar_alumno", GruposCtr.addAlumnoView);

router.get("/alumnos", AlumnosAdminCtr.show);
router.get("/alumnos/nuevo", AlumnosAdminCtr.createView);
router.get("/alumnos/:id", AlumnosAdminCtr.showById);
router.post("/alumnos/:id/update", AlumnosAdminCtr.update);
router.post("/alumnos/:id/updatePhoto", AlumnosAdminCtr.updatePhoto);
router.get("/alumnos/:id/doctos", AlumnosAdminCtr.doctos);
router.get("/alumnos/:id/doctos/:idDocto", AlumnosAdminCtr.showDocto);
router.get("/alumnos/:id/boletas", AlumnosAdminCtr.boletas);

router.get("/cuatrimestres", CuatrisCtr.index);
router.get("/cuatrimestres/nuevo", CuatrisCtr.showCreate);
router.post("/cuatrimestres/nuevo", CuatrisCtr.create);
router.get("/cuatrimestres/:id", CuatrisCtr.showById);
router.post("/cuatrimestres/:id/update", CuatrisCtr.update);
router.post("/cuatrimestres/:id/delete", CuatrisCtr.delete);

router.get("/calificaciones", GruposCtr.show);
router.get("/calificaciones/:idGrupo", CalifiCtr.showCalifi);

router.get("/carreras", NivelesCtr.show);
router.get("/carreras/crear", NivelesCtr.form);

router.get("/academico/planes", PlanesCtr.showTable);
router.get("/academico/planes/nuevo", PlanesCtr.showCreate);
router.post("/academico/planes/nuevo", PlanesCtr.crear);
router.get("/academico/planes/:id", PlanesCtr.showById);
router.post("/academico/planes/:id/actualizar", PlanesCtr.update);
router.get("/academico/planes/:id/asignaturas", PlanesCtr.showAsignaturas)
router.get("/academico/planes/:id/evaluacion", PlanesCtr.showEval)

module.exports = router;
