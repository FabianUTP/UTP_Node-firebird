const Firebird = require("./Firebird");

const Planes_Etapas = new Firebird("cfgplanes_etapas", "id_plan");

module.exports = Planes_Etapas;