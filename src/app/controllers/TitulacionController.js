const firebird = require("node-firebird");
const options = require("../../configs/credential-firebird")

const { request, response } = require("express");
const { Alumno } = require("../models/");

const TitulacionController = {};

TitulacionController.showById = async (req = request, res = response) => {
  const alumno = await Alumno.findById(req.session.IDAuth);
  let image = "data:image/jpeg;base64, ";

  firebird.attach(options, function (err, db) {
    if (err) throw err;

    db.query(
      `SELECT a.fotografia, n.acuerdo || ' en ' || n.descripcion AS carrera
      FROM alumnos a
      JOIN cfgniveles n ON a.nivel = n.nivel
      WHERE a.matricula = '${alumno?.MATRICULA}'`,
      (err, row) => {
        if (err) throw err;

        let foto = row[0]?.FOTOGRAFIA;
        let carrera = row[0]?.CARRERA;

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
              };

              db.detach();
              res.render("alumno/titulacion/titulacion-screen", {
                ...newAlumno,
                nombre: alumno.NOMBRE + ' ' + alumno.PATERNO + ' ' + alumno.MATERNO,
                matricula: alumno.MATRICULA,
                noalumno: alumno.NUMEROALUMNO,
                numeroimss: alumno.NUM_IMSS,
                cuatrimestre: alumno.GRADO,
              });
            });
          });
        } else {
          res.render("alumno/titulacion/titulacion-screen", {
            ...alumno,
            nombre: alumno.NOMBRE,
          });
        }
      }
    );
  });
};

module.exports = {
  TitulacionController,
};
