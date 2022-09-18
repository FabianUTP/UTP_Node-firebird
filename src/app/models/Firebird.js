const firebird = require("node-firebird");
const credential = require("../../configs/credential-firebird");

class Firebird {
  constructor(table = "", primaryKey = "", columns = []) {
    this.table = table; // Nombre de la tabla a usar
    this.primaryKey = primaryKey; // Llave primaria de la tabla
    this.columns = columns; // Columnas para retornar
  }

  // Obtiene todos los registros de la tabla por paginacion
  all(limit = 10, skip = 0) {
    let sql = `SELECT FIRST(${limit}) SKIP(${skip}) * FROM ${this.table}`;
    return this.createQuery(sql);
  }

  // Obtiene todos los datos por su id
  async findById(id) {
    let sql = `SELECT * FROM ${this.table} WHERE ${this.primaryKey} = ?`;
    let res = await this.createQuery(sql, [id]);
    return res.length > 0 ? res[0] : null;
  }

  // Busca por id y actualiza los datos
  findByIdAndUpdate(id, data) {
    let updateQuery = "";
    let dataQuery = [];
    let count = 0;

    for (const item in data) {
      updateQuery += `${count > 0 ? ", " : ""}${item.toLocaleUpperCase()} = ?`;
      count++;
      dataQuery.push(data[item]);
    }

    dataQuery.push(id);

    let sql = `UPDATE ${this.table} SET ${updateQuery} WHERE ${this.primaryKey} = ?`;

    return this.createQuery(sql, dataQuery);
  }

  // Busca por id y elimina el registro
  findByIdAndRemove(id) {
    return [`Update with id: ${id}`];
  }

  // Objeto con las condiciones a mostrar
  where(conditions = {}) {
    if (conditions.length === 0) return [];

    let sql = `SELECT * FROM ${this.table} WHERE`;

    for (const key in conditions) {
      conditions[key].map((item, i) => {
        if (typeof item === "string") {
          sql += ` (${key} LIKE '%${item}%') OR`;
        } else {
          sql += ` (${key} = ${item}) OR`;
        }
      });
    }

    // Elmina el ultimo OR de la consulta para la query en la DB
    if (sql.substring(sql.length - 2) === "OR") {
      sql = sql.slice(0, -3);
    }

    return this.createQuery(sql);
  }

  // Create una secuencia SQL personalizada
  createQuery(querySql = "", data = []) {
    return new Promise((resolve, reject) => {
      firebird.attach(credential, (error, db) => {
        if (error) throw error;

        db.query(querySql, data, (err, result) => {
          if (err) throw err;
          resolve(result);
          db.detach();
        });
      });
    });
  }
}

module.exports = Firebird;
