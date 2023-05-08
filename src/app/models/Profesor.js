const Firebird = require("./Firebird");

const Profesor = new Firebird('profesores', 'claveprofesor');

module.exports = Profesor;