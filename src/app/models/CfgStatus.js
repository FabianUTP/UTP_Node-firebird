const Firebird = require("./Firebird");

const CfgStatus = new Firebird("cfgstatus", "status");

module.exports = CfgStatus;