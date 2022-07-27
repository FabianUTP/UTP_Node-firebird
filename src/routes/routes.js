const express = require('express');
const router = express.Router();

const { AlumnosController, HomeController } = require('../app/controllers');


// Autenticaciones
router.get('/login', (req, res) => res.render('auth/login'));
router.post('/login', (req, res) => res.json({ body: req.body }));
router.get('/register', (req, res) => res.render('auth/register'));

// Alumnos
router.get('/', HomeController.show);
router.get('/perfil', AlumnosController.show);
router.post('/perfil', AlumnosController.update);

module.exports = router;

