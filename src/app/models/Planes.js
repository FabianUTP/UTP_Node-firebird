const Firebird = require("./Firebird");

const Planes_Det = new Firebird("cfgplanes_det", "claveasignatura");

const Planes_Etapas = new Firebird("cfgplanes_etapas", "id_plan");

const Planes_Eval = new Firebird("cfgplanes_eval", "");

const Planes_Mst = new Firebird("cfgplanes_mst", "id_plan");

module.exports = {
    Planes_Det,
    Planes_Etapas,
    Planes_Eval,
    Planes_Mst,
};