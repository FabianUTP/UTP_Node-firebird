const Firebird = require("./Firebird");

const Profesores = new Firebird("profesores", "claveprofesor");

const ProfesoresGrupos = new Firebird("profesores_grupos", "");

module.exports = {
  Profesores,
  ProfesoresGrupos,
};
