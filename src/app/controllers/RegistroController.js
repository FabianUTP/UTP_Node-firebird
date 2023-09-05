const { request, response } = require("express");
const Firebird = require("node-firebird");
const options = require("../../configs/credential-firebird");



const RegistroController = {};

// Importa los módulos necesarios
const express = require('express');


// Ruta POST para el registro
RegistroController.guardar = (req, res) => {
  let ssql = 
"INSERT INTO ALUMNOS(ID_ESCUELA, NUMEROALUMNO, PATERNO, MATERNO, NOMBRE, TIPO_SEG_MED, NUM_IMSS, GENERO, NIVEL, GRADO,CLAVE_CIUDADANA, ESTADO_CIVIL, FECHA_NACIMIENTO, DOMICILIO, ENTRE_CALLES, CP, CIUDAD, ESTADO, TELEFONO, CELULAR, USERNAME, ID_CAMPUS, EMAIL, EMAIL_ALTERNO, LUGAR_NACIMIENTO, ESTADO_NACIMIENTO, NACIONALIDAD, ESCUELA_PROCEDENCIA, ESTADO_ESCOLARIDAD, FECHA_INGRESO, LENGUAINDIGENA, DISCAPACIDAD, ENFERNEDAD, ALERGIAS, PESO_KG, TALLA, CONTACTO, PARENTESCO_CONTACTO, TEL_CONTACTO, NOMBREPADRE, NOMBREMADRE, ESCOLARIDADPADRE, ESCOLARIDADMADRE, ACTIVIDADPADRE, ACTIVIDADMADRE, AUTOMOVILFAMILIAR, COMPUTADORA, TAMANOCASA, INFRESOFAMILIAR, PERSONASDEPENDENINGRESO, VIVENENCASA, HERMANOS, LUGARNACIMIENTO, HERMANOSESTUDIAN, TRABAJAS, ACTIVIDADTRABAJAS, HORARIOTRABAJO, ESTADOCIVIL, NOMBRECONYUGE, ESCOLARIDADCONYUGE, ACTIVIDADCONYUGE, HIJOS0A5, HIJOS6A12, HIJOS13A18, HIJOSMAYORES, ALUMNO_ALTAINICIAL, ALUMNO_ALTAFINAL, ALUMNO_ALTAPERIODO) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?, CURRENT_TIMESTAMP,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) RETURNING  NUMEROALUMNO";                                                                                                                      

  const values = [
    1,//ID ESCUELA
    req.body.NUMEROALUMNO,
    req.body.PATERNO,
    req.body.MATERNO,
    req.body.NOMBRE,
    req.body.TIPO_SEG_MED,
    req.body.NUM_IMSS,
    req.body.GENERO,
    req.body.NIVEL,
    0,//GRADO
    req.body.CLAVE_CIUDADANA,
    req.body.ESTADO_CIVIL,
    req.body.FECHA_NACIMIENTO,
    req.body.DOMICILIO,
    req.body.ENTRE_CALLES,
    req.body.CP,
    req.body.CIUDAD,
    req.body.ESTADO,
    req.body.TELEFONO,
    req.body.CELULAR,
    "registro", // Cambiado el valor de req.body.USERNAME por "registro"
    0,//ID CAMPUS
    req.body.EMAIL,
    req.body.EMAIL_ALTERNO,
    req.body.LUGAR_NACIMIENTO,
    req.body.ESTADO_NACIMIENTO,
    req.body.NACIONALIDAD,
    req.body.ESCUELA_PROCEDENCIA,
    req.body.ESTADO_ESCOLARIDAD,
    req.body.LENGUAINDIGENA,
    req.body.DISCAPACIDAD,
    req.body.ENFERNEDAD,
    req.body.ALERGIAS,
    req.body.PESO_KG,
    req.body.TALLA,
    req.body.CONTACTO,
    req.body.PARENTESCO_CONTACTO,
    req.body.TEL_CONTACTO,
    req.body.NOMBREPADRE,
    req.body.NOMBREMADRE,
    req.body.ESCOLARIDADPADRE,
    req.body.ESCOLARIDADMADRE,
    req.body.ACTIVIDADPADRE,
    req.body.ACTIVIDADMADRE,
    req.body.AUTOMOVILFAMILIAR,
    req.body.COMPUTADORA,
    req.body.TAMANOCASA,
    req.body.INFRESOFAMILIAR,
    req.body.PERSONASDEPENDENINGRESO,
    req.body.VIVENENCASA,
    req.body.HERMANOS,
    req.body.LUGARNACIMIENTO,
    req.body.HERMANOSESTUDIAN,
    req.body.TRABAJAS,
    req.body.ACTIVIDADTRABAJAS,
    req.body.HORARIOTRABAJO,
    req.body.ESTADOCIVIL,
    req.body.NOMBRECONYUGE,
    req.body.ESCOLARIDADCONYUGE,
    req.body.ACTIVIDADCONYUGE,
    req.body.HIJOS0A5,
    req.body.HIJOS6A12,
    req.body.HIJOS13A18,
    req.body.HIJOSMAYORES,
    req.body.ALUMNO_ALTAINICIAL,
    req.body.ALUMNO_ALTAFINAL,
    0
    
  ];

  
  executeQuery(ssql, values)
  .then(result => {
    // Renderiza la vista y pasa el resultado de la consulta como contexto
    res.render('auth/verificacionGrupos', { resultadoConsulta: result });
  })
  .catch(err => {
    console.error(err);
    // Maneja los errores adecuadamente
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
  
  

// Exporta el router para usarlo en otros archivos
module.exports =  {RegistroController,};

