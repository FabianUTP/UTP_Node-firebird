const Firebird = require("./Firebird");

const Pagosalum = new Firebird('cfgpagos_det', 'codigo_plan');

module.exports = Pagosalum;