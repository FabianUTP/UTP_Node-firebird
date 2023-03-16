const { Alumno, AlumKardex, Aspirante } = require("./Alumno");
const Doctos = require("./Doctos");
const Grupos = require("./Grupos");
const Ciclos = require("./Ciclos");
const Niveles = require("./Niveles");
const AlumnosGrupos = require("./GrupoAlumno");
const {
  Planes_Mst,
  Planes_Det,
  Planes_Etapas,
  Planes_Eval,
} = require("./Planes");
const CfgStatus = require("./CfgStatus");
const { Profesores, ProfesoresGrupos } = require("./Profesores");
const { VillasAlumnos, VillasCfg, VillasMst } = require("./Villas");

module.exports = {
  Alumno,
  Aspirante,
  Doctos,
  Grupos,
  Ciclos,
  Niveles,
  AlumnosGrupos,
  AlumKardex,
  CfgStatus,
  Planes_Det,
  Planes_Etapas,
  Planes_Mst,
  Planes_Eval,
  Profesores,
  ProfesoresGrupos,
  VillasMst,
  VillasCfg,
  VillasAlumnos,
};
