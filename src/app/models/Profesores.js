const Firebird = require("./Firebird");

const ProfeAuth = new Firebird("profesores", "email");

const Profesores = new Firebird("profesores", "claveprofesor");

const ProfesoresGrupos = new Firebird("profesores_grupos", "");

module.exports = {
  Profesores,
  ProfesoresGrupos,
  ProfeAuth,
};
