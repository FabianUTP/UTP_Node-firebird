const firebird = require("node-firebird");
const options = require("../../configs/credential-firebird")
const { request, response } = require("express");
const { Alumno } = require("../models/");

const AlumnosController = {};

AlumnosController.showById = async (req = request, res = response) => {
  const alumno = await Alumno.findById(req.session.IDAuth);
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

              db.detach();
              res.render("alumno/perfil/perfil-screen", newAlumno);
            });
          });
        } else {
          res.render("alumno/perfil/perfil-screen", alumno);
        }
      }
    );
  });
};

AlumnosController.updateContact = async (req = request, res = response) => {
  const body = {
    domicilio: req.body.domicilio,
    celular: req.body.celular,
    estado: req.body.estado,
    ciudad: req.body.ciudad,
    cp: req.body.cp,
    email: req.body.email,
    email_alterno: req.body.emailutp,
    telefono: req.body.telefono,  
  };

 await Alumno.findByIdAndUpdate(req.session.IDAuth, body);
  res.redirect("/perfil");
};

AlumnosController.updatePerContact = async (req = request, res = response) => {
  const body = {
    contacto: req.body.perContacto,
    PARENTESCO_CONTACTO: req.body.PARENTESCO_CONTACTO,
    TEL_CONTACTO: req.body.telContacto,
  };

  await Alumno.findByIdAndUpdate(req.session.IDAuth, body);
  res.redirect("/perfil");
};

AlumnosController.updateSeguro = async (req = request, res = response) => {
  const body = {
    TIPO_SEG_MED: req.body.TIPO_SEG_MED,
    num_imss: req.body.nss,
    num_imss_verificador: req.body.nss_verif,
  };

  await Alumno.findByIdAndUpdate(req.session.IDAuth, body);
  res.redirect("/perfil");
};

AlumnosController.updateBeca = async (req = request, res = response) => {
  const body = {
    NIVELCOMPLETO: req.body.instbecabach,
    CARRERACOMPLETO: req.body.becabach,
    hijos6a12: req.body.becainst,
    beca: req.body.becanombre,
    hijos13a18: req.body.becaestatus,
    hijosmayores: req.body.becafolio,
  };

  await Alumno.findByIdAndUpdate(req.session.IDAuth, body);
  res.redirect("/perfil");
};
AlumnosController.getBoletas = async (req = request, res = response) => {

  const alumno = await Alumno.findById(req.session.IDAuth);

  res.render("alumno/boletas/boletas-screen", alumno);
};


AlumnosController.doctos = async (req = request, res = response) => {
  const alumno = await Alumno.findById(req.session.IDAuth);

  res.render("alumno/documentos/doctos-screen", {
    numeroalumno: alumno.NUMEROALUMNO,
    nombre: alumno.NOMBRE
  });
}

AlumnosController.showDocto = async (req, res) => {
  const { idDocto } = req.params;
  const alumno = await Alumno.findById(req.session.IDAuth);

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
}

module.exports = {
  AlumnosController,
};
