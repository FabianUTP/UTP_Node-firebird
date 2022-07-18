const firebird = require("node-firebird");

const options = {};

options.host = process.env.FB_HOST;
options.port = process.env.FB_PORT;
options.database = process.env.DB_DATABASE;
options.user = process.env.FB_USER;
options.password = process.env.FB_PASS;
options.localcase_keys = false;
options.role = null;
options.pageSize = 4096;
options.pageSize = 4096;
options.retryConnectionInterval = 1000;

const getData = (table = "", columns = "*") => {
  return new Promise((resolve, reject) => {
    firebird.attach(options, (err, db) => {
      if (err) throw err;

      db.query(`SELECT ${columns} FROM ${table}`, (err, result) => {
        if (err) throw err;
        resolve(result);
        db.detach();
      });
    });

  });
};

module.exports = {
  getData,
};
