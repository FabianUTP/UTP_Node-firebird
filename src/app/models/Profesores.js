const Firebird = require("./Firebird");

const ProfeAuth = new Firebird("profesores", "claveprofesor", "password");

const Profesores = new Firebird("profesores", "claveprofesor", "password");

const ProfesoresGrupos = new Firebird("profesores_grupos", "", "password");

module.exports = {
  Profesores,
  ProfesoresGrupos,
  ProfeAuth,
};
