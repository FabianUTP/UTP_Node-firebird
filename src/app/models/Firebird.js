const firebird = require("node-firebird");
const credential = require('../../configs/credential-firebird');

class Firebird {

  constructor(table = "", primaryKey = "", columns = []) {
    this.table      = table;      // Nombre de la tabla a usar
    this.primaryKey = primaryKey; // Llave primaria de la tabla
    this.columns    = columns;    // Columnas para retornar
  }

  // Obtiene todos los registros de la tabla
  all(limit = 10, skip = 0 ) {
    return new Promise((resolve) => {
      firebird.attach(credential, (error, db) => {
        if(error) throw error;

        db.query(`SELECT FIRST(${limit}) SKIP(${skip}) * FROM ${this.table}`, (err, result) => {
          if (err) throw err;
          resolve(result);
          db.detach();
        })
      })
    });
  }

  // Obtiene todos los datos por su id
  findById(id) {
    return new Promise((resolve) => {
      firebird.attach(credential, (error, db) => {
        if(error) throw error;

        db.query(`SELECT * FROM ${this.table} WHERE ${this.primaryKey}=?`, [id], (err, result = []) => {
          if (err) throw err;
          resolve(result.length > 0 ? result[0] : {});
          db.detach();
        })

      })
    })
  }

  // Busca por id y actualiza los datos
  findByIdAndUpdate(id, data) {

    let updateQuery = '';
    let dataQuery = [];
    let count = 0;

    for(const item in data){
      updateQuery += `${count > 0 ? ', ' : ''}${item.toLocaleUpperCase()} = ?`;
      count++;
      dataQuery.push(data[item]);
    }

    dataQuery.push(id);

    return new Promise((resolve, reject) => {
      firebird.attach(credential, (error, db) => {
        if(error) throw error;

        db.query(`UPDATE ${this.table} SET ${updateQuery} WHERE ${this.primaryKey} = ?`, dataQuery, (err, result) => {
          if (err) throw err;
          resolve(result);
          db.detach();
        })
      })
    })
  }

  // Busca por id y elimina el registro
  findByIdAndRemove(id) {
    return new Promise((resolve, reject) => {
      resolve(id);
    })
  }

  // Objeto con las condiciones a mostrar
  where(conditions = {}) {

    if(conditions.length === 0) return [];

    let sql = `SELECT * FROM ${this.table} WHERE`;

    for(const key in conditions) {
      conditions[key].map((item, i) => {
        if(typeof item === "string") { 
          sql += ` (${key} LIKE '%${item}%') OR`;
        } else {
          sql += ` (${key} = ${item}) OR`;
        }
      });
    }

    // Elmina el ultimo OR de la consulta para la query en la DB
    if(sql.substring(sql.length - 2) === "OR") {
      sql = sql.slice(0, -3)
    }

    return new Promise(resolve => {
      firebird.attach(credential, (error, db) => {
        if(error) throw error;

        db.query(sql, (err, result) => {
          if (err) throw err;
          resolve(result);
          db.detach();
        })
      })
    })
  }

  // Create una secuencia SQL personalizada
  createQuery({ query = '' }) {
    return new Promise((resolve, reject) => {
      firebird.attach(credential, (error, db) => {
        if(error) throw error;

        db.query(query, (err, result) => {
          if (err) throw err;
          resolve(result);
          db.detach();
        })
      })
    })
  }

}

module.exports = Firebird;
