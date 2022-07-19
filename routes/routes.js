const express = require('express');
const router = express.Router();

const Usuario = require('../app/controllers/UsuariosController');

router.get('/', Usuario.show)

module.exports = router;

