const firebird = require("node-firebird");
const credential = require("../../configs/credential-firebird");

class Firebird {
  constructor(table = "", primaryKey = "", columns = []) {
    this.table = table; // Nombre de la tabla a usar
    this.primaryKey = primaryKey; // Llave primaria de la tabla
    this.columns = columns; // Columnas para retornar
  }

  /**
   * @param {object} query Objeto donde se define las condiciones a retornar
   * @param {number} query.limit logintud de registros a obtener, retorna 20 por default
   * @param {number} query.skip logintud de registros a saltar para la paginacion
   * @param {string} query.searchQuery sql con la columna para filtrar los registros
   * @param {string} query.orderBy Columna seleccionado a ordenar 
   * @param {string} query.sort Ordena de manera *asc* ascendente o *desc* descendente
   * @returns Los registros de la tabla por paginacion
   */
  all({ limit = 20, skip = 0, searchQuery, orderBy, sort = "asc" }) {
    let sql = `SELECT FIRST(${limit}) SKIP(${skip}) * FROM ${this.table} `;

    if (searchQuery) {
      sql += `WHERE ${searchQuery} `;
    }

    if (orderBy) {
      sql += `ORDER BY ${orderBy} ${sort}`;
    }

    return this.createQuery({ querySql: sql });
  }

  /**
   * Recibe un objeto de la tabla del cual se desee nuevo regsitro
   * @param {object} Data Objeto con todos los datos que sean nesesarios para la tabla
   * Ejemplo: **{ 
   *  nombre: 'jesus',
   *  edad: 30,
   *  correo: jesus@correo.com
   * }**
   * @returns 
   */
  create(data) {
    let sql = `INSERT INTO ${this.table} `;
    let dataQuery = [];

    sql += "(";
    Object.keys(data).map((item) => {
      sql += `${item.toUpperCase()}, `;
    });

    // Elmina la ultima , de la consulta para la query en la DB
    sql = sql.slice(0, -2);
    sql += ") ";

    sql += "VALUES (";
    Object.values(data).map((item) => {
      dataQuery.push(item);
      sql += "?, ";
    });

    // Elmina la ultima , de la consulta para la query en la DB
    sql = sql.slice(0, -2);
    sql += ")";

    return this.createQuery({
      querySql: sql,
      data: dataQuery
    });
  }

  // Obtiene todos los datos por su id
  /**
   * 
   * @param {string | number} id Busca por el id de la columna en la tabla registrado en su Model
   * @returns {Object | null} Retorna un objeto con el id encontrado, y *null* en caso contrario
   */
  async findById(id) {
    let sql = `SELECT * FROM ${this.table} WHERE ${this.primaryKey} = ?`;
    let res = await this.createQuery({
      querySql: sql,
      data: [id]
    });
    return res.length > 0 ? res[0] : null;
  }

  /**
   * Busca por id y actualiza los datos
   * @param {string | number} id Busca por el id de la columna en la tabla registrado en su Model
   * @param {object} data Objeto con los datos a actualizar, ejemplo **{ correo: nuevoCorreo@correo.com }**
   */
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

    return this.createQuery({
      querySql: sql,
      data: dataQuery
    });
  }

  /**
   * Busca por id y elimina el registro
   * @param {number | string} id Id segun establecido en su Model
   * @returns 
   */
  findByIdAndRemove(id) {
    let sql = `DELETE FROM ${this.table} WHERE ${this.primaryKey} = ?`;
    return this.createQuery({ querySql: sql, data: [id] })
  }

  /**
   * Filtra los registros por condiciones
   * @param {object} conditions Recibe un objeto con las columnas de la tabla a condicionar, 
   * seguido de un array con las condiciones, ejemplo **{ nombre: ['carlos', 'fabian'], edad: [12] }**
   * @param {object} config Limite de registros a obtener
   * @param {number} config.limit Limite de registros a obtener, retorna 30 por default
   * @param {number} config.skip Limite de registros a saltar para la paginacion
   * @param {boolean} config.strict Define si los registros seran si o si los que estan condicionados, por defecto es *true*
   * @returns Regresa un array de los datos condicionados
   */
  where(conditions = {}, {limit = 30, skip = 0, strict = true}) {
    if (conditions.length === 0) return [];

    let sql = `SELECT FIRST(${limit || 30}) SKIP(${skip || 0}) * FROM ${this.table} WHERE`;

    for (const key in conditions) {
      conditions[key].map((item) => {
        if (item) {
          if (typeof item === "string") {
            const modeStrict = `(${key} = '${item}')`;
            const modeNoStrict = `(${key} LIKE '%${item}%')`;
  
            sql += ` ${strict ? modeStrict : modeNoStrict}`;
          } else {
            sql += ` (${key} = ${item})`;
          }
          
          // Valida si es modo estricto en los filtros
          sql += ` ${strict ? "AND" : "OR"}`;
        }
      });
    }

    // Elmina el ultimo OR o AND de la consulta para la query en la DB
    sql = sql.slice(0, -3);

    return this.createQuery({ querySql: sql });
  }

  // Creata la consulta SQL
  createQuery({ querySql = "", data = [] }) {
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
