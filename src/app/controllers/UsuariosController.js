const { request, response } = require("express");

const UsuariosController = {};

UsuariosController.show = (req = request, res = response) => {
    res.json({
        ok: 200
    })
}

module.exports = {
    UsuariosController
}