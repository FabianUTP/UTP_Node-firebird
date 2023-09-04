const Firebird = require('./Firebird');

class EmpleadosModel extends Firebird {
  constructor() {
    super('empleados', 'id_escuela');
  }

  async findByNumEmpleado(numEmpleado) {
    try {
      const query = `SELECT * FROM empleados WHERE id_escuela = ?`;
      const params = [numEmpleado];
      const result = await this.db.query(query, params);
      return result[0];
    } catch (error) {
      throw new Error('Error al buscar el empleado por id_empleados');
    }
  }
}

const Empleados = new EmpleadosModel();
module.exports = Empleados;
