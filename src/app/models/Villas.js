const Firebird = require("./Firebird");

const VillasMst = new Firebird('villas_mst', 'codigo_villa');

const VillasCfg = new Firebird('villas_cfg', 'id_villa_cfg');

const VillasAlumnos = new Firebird('villas_alumnos', 'id');


module.exports = {
    VillasMst,
    VillasCfg,
    VillasAlumnos,
};