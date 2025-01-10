const Firebird = require('./Firebird');

class Empresas extends Firebird {
    constructor() {
        super('cfgempresas', 'id_empresa');
    }

    async create(data) {
        let sql = `INSERT INTO CFGEMPRESAS (NOMBRE_EMPRESA, CEDULA_FISCAL_EMPRESA, DOMICILIO_EMPRESA, NUMEXT_EMPRESA, NUMINT_EMPRESA, COLONIA_EMPRESA, CP_EMPRESA, LOCALIDAD_EMPRESA, CIUDAD_EMPRESA, ESTADO_EMPRESA, TELEFONO1_EMPRESA, EMAIL) `;
        let dataQuery = [];
      
        sql += "VALUES (";
        sql += "?, ".repeat(12); // Repetir el marcador de posición "?" para cada columna
      
        // Elimina la última coma de la consulta SQL
        sql = sql.slice(0, -2);
        sql += ")";
      
        Object.values(data).forEach((item) => {
          dataQuery.push(item);
        });
      
        return this.createQuery({
          querySql: sql,
          data: dataQuery
        });
      }
      


    async getAll() {
        let sql = `SELECT * FROM ${this.table}`;
        return this.createQuery({ querySql: sql });
    }
}

module.exports = new Empresas();
