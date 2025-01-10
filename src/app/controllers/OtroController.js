const { request, response } = require("express");
const Firebird = require("node-firebird");
const options = require("../../configs/credential-firebird");

const OtroController = {};

const express = require('express');


// Ruta POST para el registro
OtroController.vincular = (req, res) => {
  let ssql = "UPDATE ALUMNOS_GRUPOS SET CODIGO_GRUPO = ? WHERE NUMEROALUMNO = ?";

  executeQuery(ssql, [req.body.CODIGO_GRUPO, req.body.NUMEROALUMNO])
    .then(result => {
       // Imprime el resultado en la consola
      // Aquí puedes hacer cualquier otra cosa que necesites con el resultado
     // Después de la actualización exitosa, envía una respuesta con la URL de redirección
res.json({ message: 'Actualización exitosa', redirect: '/correcto' });

    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: "Error al actualizar el registro." });
    });
};

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
  
  
// Resto del código del controlador...

module.exports = { OtroController };
