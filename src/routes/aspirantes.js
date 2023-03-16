const express = require("express");
const router = express.Router();



router.get("/contactar", (req, res) => res.render("others/contacto-screen"));

module.exports = router;
