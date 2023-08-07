const { request, response } = require("express");

const { Niveles } = require("../models");

const FichasCtr = {}

FichasCtr.doctos = async (req = request, res = response) => {
    let niveles = await Niveles.all({
        limit: 30,
        orderBy: 'acuerdo'
    });

    res.render('admin/alumnos/doctos-admin-screen', {
        niveles
    });
}


module.exports = {
    FichasCtr
};