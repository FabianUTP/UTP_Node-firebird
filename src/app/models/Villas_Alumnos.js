const Firebird = require("./Firebird");

const VillasAlumnos = new Firebird('villas_alumnos', 'id');

module.exports = VillasAlumnos;