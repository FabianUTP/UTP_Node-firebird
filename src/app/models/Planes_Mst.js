const Firebird = require("./Firebird");

const Planes_Mst = new Firebird("cfgplanes_mst", "id_plan");

module.exports = Planes_Mst;