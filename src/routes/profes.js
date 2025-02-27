const express = require("express");
const router = express.Router();
const {
  GruposCtr,
  CuatrisCtr,
  NivelesCtr,
  AlumnosAdminCtr,
  CalifiCtr,
  PlanesCtr,
  ProfeCtr,

} = require("../app/controllers");


const { isAlumno } = require("../app/middlewares/session");

// Controladores
const {AlumnosController} = require("../app/controllers");
const PDFController = require("../app/controllers/PdfController");

//Apartado Boletas y Documentos
router.get("/BoletasAlumnos", isAlumno, PDFController.showById);
router.get("/doctos", isAlumno, AlumnosController.doctos);
router.get("/doctos/:idDocto", AlumnosController.showDocto);

//Apartado del Perfil de alumnos
router.get("/perfil", isAlumno, AlumnosController.showById);
router.post("/perfil/update-contacto", AlumnosController.updateContact);
router.post("/perfil/update-per-contac", AlumnosController.updatePerContact);
router.post("/perfil/update-seguro", AlumnosController.updateSeguro);
router.post("/perfil/update-beca", AlumnosController.updateBeca);

//PROFESORES
router.get("/profesores", AlumnosAdminCtr.showByIdprofesor);
router.get("/profesores/nuevo", AlumnosAdminCtr.createViewprofesor);
router.get("/profesores/:id", AlumnosAdminCtr.showByIdprofesor);
router.post("/profesores/:id/update", AlumnosAdminCtr.updateprofesor);
router.post("/profesores/:id/updatePhoto", AlumnosAdminCtr.updatePhotoprofesor);
router.get("/profesores/:id/doctos", AlumnosAdminCtr.doctosprofesor);
router.get("/profesores/:id/doctos/:idDocto", AlumnosAdminCtr.showDoctoprofesor);
router.get("/profesores/:id/boletas", AlumnosAdminCtr.boletasprofesor);

// // Rutas para los alumnos
// router.get("/alumnos", AlumnosAdminCtr.show);
// router.get("/alumnos/nuevo", AlumnosAdminCtr.createView);
// router.get("/alumnos/:id", AlumnosAdminCtr.showById);
// router.post("/alumnos/:id/update", AlumnosAdminCtr.update);
// router.post("/alumnos/:id/updatePhoto", AlumnosAdminCtr.updatePhoto);
// router.get("/alumnos/:id/doctos", AlumnosAdminCtr.doctos);
// router.get("/alumnos/:id/doctos/:idDocto", AlumnosAdminCtr.showDocto);
// router.get("/alumnos/:id/boletas", AlumnosAdminCtr.boletas);

// Rutas para el Show de profesores->
router.get("/gruposprofe", GruposCtr.showProfesores);
router.get("/gruposprofe/crear", GruposCtr.addViewProfesores);
// route.post("/gruposprofe/info", GruposCtr.getProfesorInfo);
router.get("/gruposprofe/:idGrupo", GruposCtr.showByIdProfesores);
router.get("/gruposprofe/:idGrupo/editar", GruposCtr.editViewProfesores);
router.get("/grupos/:idGrupo/agregar_alumno", GruposCtr.addAlumnoViewProfesores);
router.get("/gruposprofeCalifi", GruposCtr.showAnotherProfesores);
router.get("/gruposprofeCalifi/:idGrupo", GruposCtr.showByIdAnotherProfesores);

// Importar middlewares y controladores
const { isProfesor } = require("../app/middlewares/session");
const profesorGrupoController = require('../app/controllers/profesorGrupoController');
const { ProfGrp } = require("../app/controllers/profesorGrupoController");
const { route } = require("./admin");

// Definir rutas con sus controladores y middlewares
router.get("/profesores/:id", ProfeCtr.showById);
router.get("/datos", isProfesor, (req, res) => res.render("profes/profesores-id"));
router.get("/grupoprofe", ProfGrp.showGrupo);


//mostrar datos y subir calificaciones
router.get("/grupoprofe/:id/ver_calif", ProfGrp.showViewCalif);
router.get("/grupoprofe/:id/subir_calif", ProfGrp.showSubirCalif);

module.exports = router;








