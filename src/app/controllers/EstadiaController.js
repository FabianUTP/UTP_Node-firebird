const firebird = require("node-firebird");
const options = require("../../configs/credential-firebird");
const { request, response } = require("express");
const axios = require('axios'); 
const { Alumno, Niveles, Doctos } = require("../models/");

const EstadiaController = {};

EstadiaController.showById = async (req = request, res = response) => {
  const alumno = await Alumno.findById(req.session.IDAuth);

  let image = "data:image/jpeg;base64, ";

  firebird.attach(options, function (err, db) {
    if (err) throw err;

    db.query(
      `SELECT a.fotografia, n.acuerdo || ' en ' || n.descripcion AS carrera, a.genero
      FROM alumnos a
      JOIN cfgniveles n ON a.nivel = n.nivel
      WHERE a.matricula = '${alumno?.MATRICULA}'`,
      (err, row) => {
        if (err) throw err;

        let foto = row[0]?.FOTOGRAFIA;
        let carrera = row[0]?.CARRERA;
        let genero = row[0]?.GENERO; // Agregar la columna "genero" en la consulta SQL

        if (foto) {
          foto(function (err, _name, e) {
            if (err) throw err;

            let chunks = [];
            e.on("data", (chunk) => {
              chunks.push(chunk);
            });

            e.on("end", () => {
              let buffer = Buffer.concat(chunks);
              image += buffer.toString("base64");

              let newAlumno = {
                ...alumno,
                image,
                carrera,
                genero, // Agregar el género al objeto newAlumno
                nombre: alumno.NOMBRE + ' ' + alumno.PATERNO + ' ' + alumno.MATERNO,
                matricula: alumno.MATRICULA,
                noalumno: alumno.NUMEROALUMNO,
                numeroimss: alumno.NUM_IMSS,
                cuatrimestre: alumno.GRADO,
              };

              db.detach();

              // Llamar a la función `EstadiaController.empresas` después de obtener los datos de `showById`
              EstadiaController.empresas(req, res, newAlumno);
            });
          });
        } else {
          // Si no hay foto, renderizar la vista sin imagen ni carrera
          res.render("alumno/estadia/estadia-screen", {
            ...alumno,
            genero, // Agregar el género al objeto que se pasa a la vista
            empresas: JSON.stringify(empresas), // Convertir el objeto a una cadena JSON
            nombresEmpresas: nombresEmpresas,
            nombresEmpleados: nombresEmpleados,
            nombresMaestros: nombresMaestros,
          });
        }
      }
    );
  });
};

EstadiaController.getDoctos = async (req, res) => {
  const { grado, numalumno } = req.query;

  if (!grado || !numalumno) {
    return res.json({
      error: 'Se necesita el grado a buscar y el número del alumno'
    });
  }

  try {
    // Obtener los documentos relacionados
    const cfgDoctos = new CFGDoctos();
    cfgDoctos.query().where('grado', grado).andWhere('clave', numalumno);

    if (!cfgDoctos.result || cfgDoctos.result.length === 0) {
      return res.json({
        error: 'No se encontraron CFGDOCTOS para los datos proporcionados'
      });
    }

    const documentosRelacionados = await cfgDoctos.getDocumentosRelacionados();

    return res.json({
      documentos: documentosRelacionados,
    });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener los documentos' });
  }
};



// EstadiaController.empresas 
EstadiaController.empresas = async (req = request, res = response, newAlumno) => {
  firebird.attach(options, function (err, db) {
    if (err) throw err;

    const query = `SELECT NOMBRE_EMPRESA, CEDULA_FISCAL_EMPRESA, DOMICILIO_EMPRESA, NUMEXT_EMPRESA, NUMINT_EMPRESA, COLONIA_EMPRESA, CP_EMPRESA, LOCALIDAD_EMPRESA, CIUDAD_EMPRESA, ESTADO_EMPRESA, TELEFONO1_EMPRESA, EMAIL FROM CFGEMPRESAS WHERE SERVICIOSOCIAL = 'S' OR PRACTICAS = 'S'`;

    db.query(query, (err, result) => {
      if (err) throw err;

      const empresas = result.map((row) => { 
        return {
          nombreempresa: row.NOMBRE_EMPRESA,
          rfc: row.CEDULA_FISCAL_EMPRESA,
          domicilio: row.DOMICILIO_EMPRESA,
          numeroext: row.NUMEXT_EMPRESA,
          numeroint: row.NUMINT_EMPRESA,
          colonia: row.COLONIA_EMPRESA,
          cp: row.CP_EMPRESA,
          localidad: row.LOCALIDAD_EMPRESA,
          municipio: row.CIUDAD_EMPRESA,
          estado: row.ESTADO_EMPRESA,
          telefono: row.TELEFONO1_EMPRESA,
          correo: row.EMAIL
        };
      });

      const nombresEmpresas = empresas.map((empresa) => empresa.nombreempresa);

      db.detach();

      // Llamar a la función `EstadiaController.asesorEmpresarial` después de obtener los datos de `empresas`
      EstadiaController.asesorEmpresarial(req, res, newAlumno, nombresEmpresas, empresas);
    });
  });
};

//Agregar Empresa
EstadiaController.agregarEmpresa = async (req = request, res = response) => {
  const nuevaEmpresa = req.body;

  try {
    // Realiza las validaciones necesarias en los datos recibidos
    if (!nuevaEmpresa || Object.keys(nuevaEmpresa).length === 0) {
      return res.status(400).json({ error: 'Datos de empresa no proporcionados' });
    }

    // Realiza las operaciones necesarias para guardar la empresa en la base de datos
    const {
      nombreempresa,
      rfc,
      telefono,
      correo,
      domicilio,
      numeroext,
      numeroint,
      colonia,
      cp,
      localidad,
      municipio,
      estado
    } = nuevaEmpresa;

    // Ejecutar la sentencia INSERT en la base de datos
    const query = `
      INSERT INTO CFGEMPRESAS (
        NOMBRE_EMPRESA,
        CEDULA_FISCAL_EMPRESA,
        TELEFONO1_EMPRESA,
        EMAIL,
        DOMICILIO_EMPRESA,
        NUMEXT_EMPRESA,
        NUMINT_EMPRESA,
        COLONIA_EMPRESA,
        CP_EMPRESA,
        LOCALIDAD_EMPRESA,
        CIUDAD_EMPRESA,
        ESTADO_EMPRESA
      )
      VALUES (
        '${nombreempresa}',
        '${rfc}',
        '${telefono}',
        '${correo}',
        '${domicilio}',
        '${numeroext}',
        '${numeroint}',
        '${colonia}',
        '${cp}',
        '${localidad}',
        '${municipio}',
        '${estado}'
      )`;

    await firebird.query(query);

    res.status(201).json({ message: 'Empresa agregada exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al agregar la empresa' });
  }
};


// EstadiaController.asesorEmpresarial 
EstadiaController.asesorEmpresarial = async (req = request, res = response, newAlumno, nombresEmpresas) => {
  firebird.attach(options, function (err, db) {
    if (err) throw err;

    const queryEmpleados = `SELECT NOMBREEMPLEADO FROM EMPLEADOS WHERE STATUSACTUAL = 'A'`;
    const queryMaestros = `SELECT NOMBREPROFESOR FROM PROFESORES WHERE STATUSACTUAL = 'A'`;

    let nombresEmpleados = []; // Cambio: Cambiar const por let
    let nombresMaestros = []; // Cambio: Cambiar const por let

    db.query(queryEmpleados, (err, resultEmpleados) => {
      if (err) throw err;

      nombresEmpleados = resultEmpleados.map((row) => row.NOMBREEMPLEADO);

      db.query(queryMaestros, (err, resultMaestros) => {
        if (err) throw err;

        nombresMaestros = resultMaestros.map((row) => row.NOMBREPROFESOR);

        db.detach();

        // Llamar a la función `EstadiaController.asesorAcademico` después de obtener los datos de `asesorEmpresarial`
        EstadiaController.asesorAcademico(req, res, newAlumno, nombresEmpresas, nombresEmpleados, nombresMaestros);
      });
    });
  });
};



// EstadiaController.asesorAcademico 
EstadiaController.asesorAcademico = async (req = request, res = response, newAlumno, nombresEmpresas, nombresEmpleados) => {
  firebird.attach(options, function (err, db) {
    if (err) throw err;

    const query = `SELECT NOMBREPROFESOR FROM PROFESORES WHERE STATUSACTUAL = 'A'`;

    db.query(query, (err, result) => {
      if (err) throw err;

      const nombresMaestros = result.map((row) => row.NOMBREPROFESOR);

      db.detach();

      res.render("alumno/estadia/estadia-screen", {
        ...newAlumno,
        nombresEmpresas: nombresEmpresas,
        nombresEmpleados: nombresEmpleados,
        nombresMaestros: nombresMaestros,
      });
    });
  });
};

module.exports = {
  EstadiaController,
};
