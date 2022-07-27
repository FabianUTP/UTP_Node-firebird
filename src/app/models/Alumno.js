const Firebird = require("./Firebird");

const Alumno = new Firebird('alumnos', 'numeroalumno');

module.exports = Alumno;