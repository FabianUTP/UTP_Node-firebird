const express = require("express");
const router = express.Router();

// Middleware para las sesiones
const { verifySesion, noAuth } = require("../app/middlewares/session");

// Controladores
const { AuthController, HomeController, InscripcionesController, RegistroController, OtroController, GruposalumnosController } = require("../app/controllers");

// Login y Autenticaciones
router.get("/login", noAuth, AuthController.login); // Vista principal
router.get("/logout", AuthController.logout); // Para cerrar sesión

// Ruta para autenticar las diferentes sesiones
router.post("/login/alumno", AuthController.authAlumno);
router.post("/login/aspirante", AuthController.authAspirante);
router.post("/login/profe", AuthController.authProfe);
router.post("/login/admin", AuthController.authAdmin);


//Rutas Externas Para iniciar sesion
router.get("/verificacionCURP", (req, res) => {res.render("auth/verificacionCurp");});
router.get("/registroAspirante", (req, res) => {res.render("auth/registroAspirante");});
router.get("/gruposalumnos", (req, res) => {res.render("auth/verificacionGrupos");});
router.get("/correcto", (req, res) => {res.render("others/correcto");});


//Rutas Solicitudes HTPP
router.get('/clave', InscripcionesController.curp);
router.post('/pegar', RegistroController.guardar);
router.put('/vincular', OtroController.vincular);
router.get('/obtener', GruposalumnosController.obtenerGrupos);





// Middleware para que se inicie sesión
router.use(verifySesion);

// Ruta principal para el dashboard de todas las sesiones
router.get("/", HomeController.index);

// Rutas del alumno
router.use(require('./alumno'));
// Rutas de los aspirantes
router.use(require('./aspirantes'));
// Rutas de los profesores
router.use(require('./profes'));
// Rutas del administrador
router.use(require('./admin'));

// Devuelve la vista de la pagina 404 - Page not found
router.get("*", (req, res) => res.status(404).render("others/error404"));

module.exports = router;
