const Firebird = require("./Firebird");

const Alumno = new Firebird('alumnos', 'matricula');

const AlumKardex = new Firebird("alumnos_kardex");

module.exports = {
    Alumno,
    AlumKardex,
};