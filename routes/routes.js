const express = require('express');
const router = express.Router();


const { AlumnosController } = require('../app/controllers')

router.get('/login', (req, res) => res.sendFile('login.html', {
    root: path
}));

// Usuarios
router.get('/', (req, res) => res.render('home'));

// Alumnos
router.get('/perfil', AlumnosController.show);
router.put('/perfil', AlumnosController.update);

module.exports = router;

