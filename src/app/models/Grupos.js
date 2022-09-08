const Firebird = require("./Firebird");

const Grupos = new Firebird('grupos', 'codigo_grupo');

module.exports = Grupos;