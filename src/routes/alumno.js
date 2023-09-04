const express = require("express");
const router = express.Router();
const fileUpload = require('express-fileupload');

// Siempre poner este middleware al crear una ruta get
const { isAlumno } = require("../app/middlewares/session");

// Controladores
const {AlumnosController} = require("../app/controllers");
const {EstadiaController} = require("../app/controllers/EstadiaController");
const {TitulacionController} = require("../app/controllers/TitulacionController");


// Rutas de los Alumnos.

//Apartado Boletas y Documentos
router.get("/boletas", isAlumno, AlumnosController.getBoletas);
router.get("/doctos", isAlumno, AlumnosController.doctos);
router.get("/doctos/:idDocto", AlumnosController.showDocto);

//Apartado del Perfil de alumnos
router.get("/perfil", isAlumno, AlumnosController.showById);
router.post("/perfil/update-contacto", AlumnosController.updateContact);
router.post("/perfil/update-per-contac", AlumnosController.updatePerContact);
router.post("/perfil/update-seguro", AlumnosController.updateSeguro);
router.post("/perfil/update-beca", AlumnosController.updateBeca);

//Apartado de modulo Estadia
router.get("/estadia", isAlumno, EstadiaController.showById);
router.get('/estadia/getDoctos', isAlumno, EstadiaController.getDoctos);
router.get('/estadia/empresas', isAlumno, EstadiaController.empresas);
router.post('/estadia/empresas', isAlumno, EstadiaController.agregarEmpresa);
router.get('/estadia/asesor-empresarial', EstadiaController.asesorEmpresarial);
router.get('/estadia/asesor-academico', EstadiaController.asesorAcademico);

//Apartado Titulación
router.get("/titulacion", isAlumno, TitulacionController.showById);

router.get("/contactar", (req, res) => res.render("others/contacto-screen"));

module.exports = router;
