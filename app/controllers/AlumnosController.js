const { request, response } = require("express");
const Alumno = require("../models/Alumno");

const AlumnosController = {};

AlumnosController.show = async (req = request, res = response) => {
    const [alumno] = await Alumno.findById('18090186');
    res.render('perfil/perfil-screen', alumno);
}

AlumnosController.update = (req = request, res = response) => {

    const alumno = req.body;

    res.json({
        body: alumno
    })
}

module.exports = {
    AlumnosController
}