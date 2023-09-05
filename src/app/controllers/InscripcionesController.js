
const { request, response } = require("express");
const { Alumno } = require("../models");
const Firebird = require("node-firebird");
const options = require("../../configs/credential-firebird");


const InscripcionesController = {};

InscripcionesController.curp = (req, res) => {
  const CLAVE_CIUDADANA = req.query.CLAVE_CIUDADANA;

  if (!CLAVE_CIUDADANA) {
    res.status(400).send('Debe proporcionar una CLAVE_CIUDADANA');
    return;
  }

  const ssql = 'SELECT CLAVE_CIUDADANA, COUNT(*) AS contador FROM ALUMNOS GROUP BY CLAVE_CIUDADANA';

  executeQuery(ssql)
    .then(result => {
      const CLAVE_CIUDADANAs = result.map(row => row.CLAVE_CIUDADANA);
      if (CLAVE_CIUDADANAs.includes(CLAVE_CIUDADANA)) {
        res.send('<script>alert("La CLAVE_CIUDADANA ya está registrada."); window.history.back();</script>');
      } else {
        res.redirect('/registroAspirante');
        
      }
    })
    .catch(error => {
      console.error(error);
      res.status(500).send('Error al ejecutar la consulta');
    });
}

function executeQuery(ssql, params) {
  return new Promise((resolve, reject) => {
    Firebird.attach(options, (err, db) => {
      if (err) {
        reject(err);
        return;
      }

      db.query(ssql, params, (err, result) => {
        db.detach();
        if (err) {
          reject(err);
          return;
        }

        resolve(result);
      });
    });
  });
}

module.exports = {InscripcionesController,};
