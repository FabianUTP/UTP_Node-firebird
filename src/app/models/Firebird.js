const firebird = require("node-firebird");
const credential = require('../../configs/credential-firebird');

class Firebird {

  constructor(table = "", primaryKey, columns = []) {
    this.table      = table;      // Nombre de la tabla a usar
    this.primaryKey = primaryKey; // Llave primaria de la tabla
    this.columns    = columns;    // Columnas para retornar
  }

  // Obtiene todos los registros de la tabla y columnas registradas
  all() {
    return new Promise((resolve, reject) => {
      firebird.attach(credential, (error, db) => {
        if(error) throw error;

        db.query(`SELECT * FROM ${this.table}`, (err, result) => {
          if (err) throw err;
          resolve(result);
          db.detach();
        })
      })
    });
  }

  // Obtiene todos los datos por su id
  findById(id) {
    return new Promise((resolve, reject) => {
      firebird.attach(credential, (error, db) => {
        if(error) throw error;

        db.query(`SELECT * FROM ${this.table} WHERE ${this.primaryKey}=?`, [id], (err, result) => {
          if (err) throw err;
          resolve(result);
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

  // Create una secuencia SQL personalizada
  createQuery(query) {
    return new Promise((resolve, reject) => {
      resolve(query);
    })
  }

}

module.exports = Firebird;
