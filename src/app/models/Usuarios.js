const Firebird = require("./Firebird");

const Usuarios = new Firebird("usuarios", "email");

module.exports = Usuarios;