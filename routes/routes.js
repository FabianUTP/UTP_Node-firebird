const express = require('express');
const router = express.Router();

const { AlumnosController } = require('../app/controllers')

// Usuarios
// router.get('/', UsuariosController.show);

// Alumnos
router.get('/alumnos', AlumnosController.show);

module.exports = router;

