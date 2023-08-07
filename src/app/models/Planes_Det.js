const Firebird = require("./Firebird");

const Planes_Det = new Firebird("cfgplanes_det", "id_plan");

module.exports = Planes_Det;