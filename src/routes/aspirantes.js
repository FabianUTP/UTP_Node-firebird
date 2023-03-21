const express = require("express");
const router = express.Router();

// Siempre poner este middleware al crear una ruta get
const { isAspirante } = require("../app/middlewares/session");

router.get("/aspirante", isAspirante, (req, res) => res.json({
  msj: "hola"
}));

router.get("/contactar", (req, res) => res.render("others/contacto-screen"));

module.exports = router;
