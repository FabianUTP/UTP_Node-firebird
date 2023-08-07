const express = require("express");
const router = express.Router();

// Siempre poner este middleware al crear una ruta get
const { isProfesor } = require("../app/middlewares/session");

router.get("/datos", isProfesor, (req, res) => res.render("profes/profesores-id"));

module.exports = router;
