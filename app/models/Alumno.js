const Firebird = require("./Firebird");

const Alumno = new Firebird('alumnos', 'matricula');

module.exports = Alumno;