const express = require("express");
const router = express.Router();
const { isAdmin } = require("../app/middlewares/session");

// Controladores
const {
  GruposCtr,
  CuatrisCtr,
  NivelesCtr,
  AlumnosAdminCtr,
  CalifiCtr,
  PlanesCtr,
  ProfeCtr,

} = require("../app/controllers");

router.use(isAdmin);

// Rutas para el Administrador
router.get("/grupos", GruposCtr.show);
router.get("/grupos/crear", GruposCtr.addView);
router.get("/grupos/:idGrupo", GruposCtr.showById);
router.get("/grupos/:idGrupo/editar", GruposCtr.editView);
router.get("/grupos/:idGrupo/agregar_alumno", GruposCtr.addAlumnoView);
router.get("/gruposCalifi", GruposCtr.showAnother);
router.get("/gruposCalifi/:idGrupo", GruposCtr.showByIdAnother);

router.get("/alumnos", AlumnosAdminCtr.show);
router.get("/alumnos/nuevo", AlumnosAdminCtr.createView);
router.get("/alumnos/:id", AlumnosAdminCtr.showById);
router.post("/alumnos/:id/update", AlumnosAdminCtr.update);
router.post("/alumnos/:id/updatePhoto", AlumnosAdminCtr.updatePhoto);
router.get("/alumnos/:id/doctos", AlumnosAdminCtr.doctos);
router.get("/alumnos/:id/doctos/:idDocto", AlumnosAdminCtr.showDocto);
router.get("/alumnos/:id/boletas", AlumnosAdminCtr.boletas);

router.get("/cuatrimestres", CuatrisCtr.index);
router.get("/Cuatri-Calific", (_req, res) => { res.render("../views/admin/config_general/cuatrimestres/Calificacion/Calificaciones.hbs")})
router.get("/Cuatri-Reins", (_req, res) => { res.render("../views/admin/config_general/cuatrimestres/Reinscripcion/Reinscripciones.hbs")})
router.get("/Cuatri-Estadia", (_req, res) => { res.render("../views/admin/config_general/cuatrimestres/Estadias/Estadias.hbs")})
router.get("/Cuatri-NIngreso", (_req, res) => { res.render("../views/admin/config_general/cuatrimestres/Nuevo Ingreso/Nuevo_Ingreso.hbs")})
router.get("/cuatrimestres/nuevo", CuatrisCtr.showCreate);
router.post("/cuatrimestres/nuevo", CuatrisCtr.create);
router.get("/cuatrimestres/:id", CuatrisCtr.showById);
router.post("/cuatrimestres/:id/update", CuatrisCtr.update);
router.post("/cuatrimestres/:id/delete", CuatrisCtr.delete);

// Ruta que renderiza una vista simple
router.get('/admin/calificacion', (req, res) => {
  res.render('admin/calificacion.hbs'); // Renderiza la vista 'admin/profes/hola'
});

router.get("/calificaciones", GruposCtr.show);
router.get("/calificaciones/:idGrupo", CalifiCtr.showCalifi);

router.get("/carreras", NivelesCtr.show);
router.get("/carreras/crear", NivelesCtr.form);

router.get("/academico/planes", PlanesCtr.showTable);
router.get("/academico/planes/nuevo", PlanesCtr.showCreate);
router.post("/academico/planes/nuevo", PlanesCtr.crearPlan);
router.get("/academico/planes/:id", PlanesCtr.showById);
router.post("/academico/planes/:id", PlanesCtr.updatePlan);

router.get("/academico/planes/:idPlan/asignaturas", PlanesCtr.showAsignaturas)
router.get("/academico/planes/:idPlan/asignaturas/:idAsig", PlanesCtr.showPlanesAsigId)
router.get("/academico/planes/:idPlan/asignaturas/crear", PlanesCtr.showCreatePlanesAsig)

router.get("/academico/planes/:idPlan/evaluacion", PlanesCtr.showEval)
router.get("/academico/planes/:idPlan/evaluacion/:idEval", PlanesCtr.showPlanesEvalId)
router.get("/academico/planes/:idPlan/evaluacion/crear", PlanesCtr.showCreatePlanesEval)

router.get("/profesores", ProfeCtr.showList);
router.get("/profesores/:id", ProfeCtr.showById);

router.get("/profesores/:id/asignacion", ProfeCtr.showAsig);
router.get("/profesores/:id/perfil", ProfeCtr.showPerfil);

router.get("/profesores/:id/ver_calif", ProfeCtr.showVerCalf);
router.get("/profesores/:id/subir_calif", ProfeCtr.showSubirCalf);

router.post("/profesores/:id/update_otros_campos", ProfeCtr.update_otros_campos);
router.post("/profesores/:id/update_ficha", ProfeCtr.update_ficha);
router.post("/profesores/:id/update_personalizados", ProfeCtr.update_personalizados);

module.exports = router;
