const firebird = require("node-firebird");
const credential = require("../../configs/credential-firebird");

class Firebird {
  constructor(table = "", primaryKey = "", columns = []) {
    this.table = table; // Nombre de la tabla a usar
    this.primaryKey = primaryKey; // Llave primaria de la tabla
    this.columns = columns; // Columnas para retornar
  }

  // Obtiene todos los registros de la tabla por paginacion
  all({ limit = 10, skip = 0, searchQuery, orderBy, sort = "asc" }) {
    let sql = `SELECT FIRST(${limit}) SKIP(${skip}) * FROM ${this.table} `;

    if (searchQuery) {
      sql += `WHERE ${searchQuery} `;
    }

    if (orderBy) {
      sql += `ORDER BY ${orderBy} ${sort}`;
    }

    return this.createQuery(sql);
  }

  // Recibe un objeto de la tabla del cual se desee nuevo regsitro
  create(data) {
    let sql = `INSERT INTO ${this.table} `;
    let sqlValues = [];

    sql += "(";
    Object.keys(data).map((item) => {
      sql += `${item.toUpperCase()}, `;
    });

    // Elmina la ultima , de la consulta para la query en la DB
    sql = sql.slice(0, -2);
    sql += ") ";

    sql += "VALUES (";
    Object.values(data).map((item) => {
      sqlValues.push(item);
      sql += "?, ";
    });

    // Elmina la ultima , de la consulta para la query en la DB
    sql = sql.slice(0, -2);
    sql += ")";

    return this.createQuery(sql, sqlValues);
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

    Object.keys(data).map((item) => {
      updateQuery += `${item.toLocaleUpperCase()} = ?, `;
    });

    // Elmina la ultima , de la consulta para la query en la DB
    updateQuery = updateQuery.slice(0, -2);

    Object.values(data).map((item) => dataQuery.push(item));
    dataQuery.push(id);

    let sql = `UPDATE ${this.table} SET ${updateQuery} WHERE ${this.primaryKey} = ?`;

    return this.createQuery(sql, dataQuery);
  }

  // Busca por id y elimina el registro
  findByIdAndRemove(id) {
    return [`Update with id: ${id}`];
  }

  // Recibe un objeto con las condiciones a mostrar
  where(conditions = {}, limit = 30, skip = 0) {
    if (conditions.length === 0) return [];

    let sql = `SELECT FIRST(${limit}) SKIP(${skip}) * FROM ${this.table} WHERE`;

    for (const key in conditions) {
      conditions[key].map((item) => {
        if (typeof item === "string") {
          sql += ` (${key} = '${item}') OR`;
        } else {
          sql += ` (${key} = ${item}) OR`;
        }
      });
    }

    // Elmina el ultimo OR de la consulta para la query en la DB
    sql = sql.slice(0, -3);

    return this.createQuery(sql);
  }

  // Filtra los resultados que coincidan con la palabra
  filter(word = '', columnsToFind = []) {
    let sql = `SELECT * FROM ${this.table} WHERE (`;

    columnsToFind.map(item => {
      sql += `(${item}) LIKE '%${word}%') OR `;
    });

    // Elimina el ultimo OR
    sql = sql.slice(0, -3);
    // Cierra el WHERE
    sql += ')';

    return sql;
  }

  // Creata la consulta SQL
  createQuery(querySql = "", data = []) {
    return new Promise((resolve) => {
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
