const express = require("express");
const router = express.Router();
const fileUpload = require('express-fileupload');

// Siempre poner este middleware al crear una ruta get
const { isAlumno } = require("../app/middlewares/session");

// Controladores
const {AlumnosController} = require("../app/controllers");
const {EstadiaController} = require("../app/controllers/EstadiaController");
const {TitulacionController} = require("../app/controllers/TitulacionController");
const PDFController = require("../app/controllers/PdfController");
const { ReinscripcionController } = require("../app/controllers");
const { GrupController,  } = require("../app/controllers");
const { GrupaluController } = require("../app/controllers");
// Rutas de los Alumnos.

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

router.get("/passworddata",isAlumno, AlumnosController.showByIdpasswords);
router.post("/passworddata/update-contactos", AlumnosController.updateContactpasswords);
router.post("/passworddata/update-per-contac", AlumnosController.updatePerContact);
router.post("/passworddata/update-seguro", AlumnosController.updateSeguro);
router.post("/passworddata/update-beca", AlumnosController.updateBeca);

router.post("/ingles/update-nivel", AlumnosController.updateNivelingles)

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

// Reinscripcion
router.get("/reinscrip-cion", isAlumno, ReinscripcionController.showById);
router.post("/reinscrip-cion/update-contacto", ReinscripcionController.updateContact);
router.post("/reinscrip-cion/update-per-contac", ReinscripcionController.updatePerContact);
router.post("/reinscrip-cion/update-seguro", ReinscripcionController.updateSeguro);

router.get("/pagos", (req, res) => (res.render("alumno/reinscripcion/pago.hbs")));
router.get("/validacion", (req, res) => (res.render("alumno/reinscripcion/validacion.hbs")));

// Grupos
router.get("/gruposs", isAlumno, GrupController.showById);
router.post("/grupos_post", GrupController.updateContacto);


module.exports = router;
