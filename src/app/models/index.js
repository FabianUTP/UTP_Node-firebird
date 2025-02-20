const { Alumno, AlumKardex, Aspirante } = require("./Alumno");
const Doctos = require("./Doctos");
const Grupos = require("./Grupos");
const Ciclos = require("./Ciclos");
const Niveles = require("./Niveles");
const AlumnosGrupos = require("./GrupoAlumno");
const AlumnosNiveles = require("./AlumnoNivel");
const {
  Planes_Mst,
  Planes_Det,
  Planes_Etapas,
  Planes_Eval,
} = require("./Planes");
const CfgStatus = require("./CfgStatus");
const profes = require("./Profesores");
const villas = require("./Villas");
const Usuarios = require("./Usuarios");
const CiclosAdmins = require("./CiclosAdmins");
const Pagosalum = require("./GrupAl");
//const Grup = require("./Grup");

module.exports = {
  Alumno,
  Aspirante,
  Doctos,
  Grupos,
  //Grup,
  Pagosalum,
  Ciclos,
  CiclosAdmins,
  Niveles,
  AlumnosGrupos,
  AlumnosNiveles,
  AlumKardex,
  CfgStatus,
  Planes_Det,
  Planes_Etapas,
  Planes_Mst,
  Planes_Eval,
  
  Usuarios,
  ...profes,
  ...villas,
};
