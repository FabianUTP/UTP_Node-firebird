const firebird = require("node-firebird");
const options = require("../../configs/credential-firebird")

const { request, response } = require("express");
const { Alumno } = require("../models/");

const ReinscripcionController = {};

ReinscripcionController.showById = async (req = request, res = response) => {
  const alumno = await Alumno.findById(req.session.IDAuth); // Busca el estudiante por su ID de autenticación

  let image = "data:image/jpeg;base64, "; // Inicializa la variable 'image' como una cadena base64 vacía

  firebird.attach(options, function (err, db) { // Conecta a la base de datos Firebird
    if (err) throw err; // Si hay un error, lánzalo

    db.query( // para la version mas reciente se usa CONCAT(n.acuerdo, ' ', n.descripcion) en vez de n.acuerdo || ' ' || n.descripcion AS carrera
      `SELECT a.fotografia, n.acuerdo || ' en ' || n.descripcion AS carrera
       FROM alumnos a
       JOIN cfgniveles n ON a.nivel = n.nivel
       WHERE a.matricula = '${alumno?.MATRICULA}'`, // Consulta para obtener la fotografía y la carrera del estudiante
      (err, row) => { // Función de devolución de llamada para el resultado de la consulta
        if (err) throw err; // Si hay un error, lánzalo

        let foto = row[0]?.FOTOGRAFIA; // Obtiene la fotografía del resultado de la consulta
        let carrera = row[0]?.CARRERA; // Obtiene la carrera del resultado de la consulta

        if (foto) { // Si hay una fotografía
          foto(function (err, _name, e) { // Función para obtener la fotografía desde la base de datos
            if (err) throw err; // Si hay un error, lánzalo

            let chunks = [];
            e.on("data", (chunk) => {
              chunks.push(chunk);
            });

            e.on("end", () => {
              let buffer = Buffer.concat(chunks);
              image += buffer.toString("base64"); // Convierte la fotografía en una cadena base64 y la asigna a la variable 'image'

              let newAlumno = {
                ...alumno,
                image,
                carrera,
              };

              db.detach(); // Cierra la conexión con la base de datos
              res.render("alumno/reinscripcion/reinscripcion-alumno", { // Renderiza la plantilla 'estadia-screen' con los datos del estudiante y la imagen de la fotografía
                ...newAlumno,
                nombre: alumno.NOMBRE + ' ' + alumno.PATERNO + ' ' + alumno.MATERNO,
                matricula: alumno.MATRICULA,
                noalumno: alumno.NUMEROALUMNO,
                numeroimss: alumno.NUM_IMSS,
                cuatrimestre: alumno.GRADO,
              });
            });
          });
        } else { // Si no hay fotografía
          res.render("alumno/reinscripcion/reinscripcion-alumno", { // Renderiza la plantilla 'estadia-screen' con los datos del estudiante
            ...alumno,
            nombre: alumno.NOMBRE, // Agregar el nombre del alumno al objeto de contexto
          });
        }
      }
    );
  });
};

ReinscripcionController.updateContact = async (req = request, res = response) => {
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
  res.redirect("/reinscrip-cion");
};

ReinscripcionController.updatePerContact = async (req = request, res = response) => {
  const body = {
    contacto: req.body.perContacto,
    PARENTESCO_CONTACTO: req.body.PARENTESCO_CONTACTO,
    TEL_CONTACTO: req.body.telContacto,
  };

  await Alumno.findByIdAndUpdate(req.session.IDAuth, body);
  res.redirect("/reinscrip-cion");
};

ReinscripcionController.updateSeguro = async (req = request, res = response) => {
  const body = {
    TIPO_SEG_MED: req.body.TIPO_SEG_MED,
    num_imss: req.body.nss,
    num_imss_verificador: req.body.nss_verif,
  };

  await Alumno.findByIdAndUpdate(req.session.IDAuth, body);
  res.redirect("/reinscrip-cion");
};

module.exports = {
    ReinscripcionController,
  };