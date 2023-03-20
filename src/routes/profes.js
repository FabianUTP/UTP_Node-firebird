const express = require("express");
const router = express.Router();





router.get("/datos", (req, res) => res.render("profes/profesores-id"));


//el primero es la ruta y el regundo es la ruta la vista
module.exports = router;
