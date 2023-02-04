const Firebird = require("./Firebird");

const Profesores = new Firebird('profesores', 'claveprofesor');

module.exports = Profesores;