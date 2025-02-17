const { request, response } = require("express");
const { Alumno } = require("../models");

const firebird = require("node-firebird");
const options = require("../../configs/credential-firebird");

const AlumnosAdminCtr = {};

AlumnosAdminCtr.createView = (req, res) => {
  res.render("admin/alumnos/alumnos/alumnos-crear");
};

AlumnosAdminCtr.show = (req, res) => {
  const { search } = req.query;
  res.render("admin/alumnos/alumnos/alumnos-lista", { search });
};

AlumnosAdminCtr.showDocto = async (req, res) => {
  const { id, idDocto } = req.params;
  const alumno = await Alumno.findById(id);

  firebird.attach(options, function (err, db) {
    if (err) throw err;

    db.query(
      `select documento from doctos 
        where clave = '${alumno.NUMEROALUMNO}' AND id_docto = '${idDocto}'`,
      (err, row) => {
        if (err) throw err;

        let docto = row[0]?.DOCUMENTO;

        if (docto) {
          docto(function (err, _name, e) {
            let chunks = [];
            e.on("data", (chunk) => {
              chunks.push(chunk);
            });

            e.on("end", () => {
              let buffer = Buffer.concat(chunks);

              res.contentType("application/pdf");
              res.send(buffer);
              db.detach();
            });
          });
        } else {
          // res.redirect(`/alumnos/${id}/doctos`);
          res.send("No hay documento");
        }
      }
    );
  });
};

AlumnosAdminCtr.showById = async (req = request, res = response) => {
  const alumno = await Alumno.findById(req.params.id);
  let image = "data:image/jpeg;base64, ";

  firebird.attach(options, function (err, db) {
    if (err) throw err;

    db.query(
      `select fotografia from alumnos where matricula = '${alumno?.MATRICULA}'`,
      (err, row) => {
        if (err) throw err;

        let foto = row[0]?.FOTOGRAFIA;
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
              };

              res.render("admin/alumnos/alumnos/alumno-id", newAlumno);

              db.detach();
            });
          });
        } else {
          res.render("admin/alumnos/alumnos/alumno-id", alumno);
        }
      }
    );
  });
};

AlumnosAdminCtr.update = async (req = request, res = response) => {
  const body = req.body;

  const data = {
    paterno: body?.paterno,
    materno: body?.materno,
    nombre: body?.nombre,
    genero: body?.genero,
    fecha_nacimiento: body?.fecha_nacimiento,
    estado_nacimiento: body?.estado_nacimiento,
    lugar_nacimiento: body?.municipio_naci,
    nacionalidad: body?.nacionalidad,
    clave_ciudadana: body?.curp,
    domicilio: body?.domicilio,
    entre_calles: body?.cruzamientos,
    estado: body?.estado,
    cp: body?.postal,
    email: body?.email_personal,
    email_alterno: body?.email_insti,
    celular: body?.tel_cel,
    telefono: body?.tel_domicilio,
    nivel: body?.nivel,
    grado: body?.grado,
    matricula: body?.matricula,
    observaciones: body?.nota,
    proyecto_obs: body?.proyecto_obs,
    obs_proyecto_lic: body?.obs_proyecto_lic,
  };

  await Alumno.findByIdAndUpdate(body?.matricula, data);

  res.redirect(`/alumnos/${body?.matricula}`);
};

AlumnosAdminCtr.updatePhoto = async (req = request, res = response) => {
  let id = req.params.id;

  if (req.files?.fotografia) {
    await Alumno.findByIdAndUpdate(id, {
      fotografia: req.files.fotografia.data,
    });
    res.redirect(`/alumnos/${id}`);
  } else {
    res.redirect(`/alumnos/${id}`);
  }
};

AlumnosAdminCtr.doctos = async (req = request, res = response) => {
  const alumno = await Alumno.findById(req.params.id);
  res.render("alumno/documentos/doctos-screen", {
    numeroalumno: alumno?.NUMEROALUMNO,
    nombre: alumno?.NOMBRE,
  });
};

AlumnosAdminCtr.boletas = async (req, res) => {
  const alumno = await Alumno.findById(req.params.id);
  res.render("alumno/boletas/boletas-screen", alumno);
};

module.exports = {
  AlumnosAdminCtr,
};
