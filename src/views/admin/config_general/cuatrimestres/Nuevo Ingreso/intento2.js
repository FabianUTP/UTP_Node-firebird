const express = require('express');
const router = express.Router();
const Firebird = require('firebird');
const options = require('../../configs/credential-firebird');

// Ruta para obtener los datos de la tabla CICLOS_ADMINS mediante una consulta SQL.
router.get('/Cuatri-NIngreso', (_req, res) => {
  const query = 'SELECT ID_ESCUELA, INICIAL, FINAL, PERIODO, FUNCION_CICLOS FROM CICLOS_ADMINS';

  // Establecer la conexión a la base de datos Firebird.
  Firebird.attach(options, (err, dbConnection) => {
    if (err) {
      console.error('Error al conectar a la base de datos:', err);
      res.status(500).send('Error al obtener los datos.');
      return;
    }

    // Ejecutar la consulta SQL.
    dbConnection.query(query, (err, rows) => {
      // Cerrar la conexión a la base de datos.
      dbConnection.detach();

      if (err) {
        console.error('Error al ejecutar la consulta:', err);
        res.status(500).send('Error al obtener los datos.');
        return;
      }

      // Responder con los datos obtenidos en formato JSON.
      const jsonData = JSON.stringify(rows, null, 2); // 2 espacios de indentación para una presentación más legible
      res.setHeader('Content-Type', 'application/json');
      res.send(jsonData);
    });
  });
});

module.exports = router;
