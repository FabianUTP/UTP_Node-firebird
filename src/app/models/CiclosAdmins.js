const Firebird = require('./Firebird');

const CiclosAdmins = new Firebird('ciclos_admins', 'id_escuela');

module.exports = CiclosAdmins;