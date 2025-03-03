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
  const alumnos = await Alumno.findById(req.params.id);
  res.render("alumno/boletas/boletas-screen", alumnos);
};


















// TITULACIÓN formato TITULACION

AlumnosAdminCtr.createViewTitul = (req, res) => {
  res.render("admin/alumnos/alumnos/Titulacion/titulacion-crear");
};
// Mostrar listado de Titulaciones
AlumnosAdminCtr.showTitul = (req, res) => {
  const { search } = req.query;
  res.render("admin/alumnos/alumnos/Titulacion/titulacion-lista", { search });
};
// Mostrar documento de Titulación
AlumnosAdminCtr.showDoctoTitul = async (req, res) => {
  const { id, idDocto } = req.params;
  const titulaciones = await Alumno.findById(id);

  firebird.attach(options, function (err, db) {
    if (err) throw err;

    db.query(
      `select documento from doctos where clave = '${titulaciones.NUMEROALUMNO}' AND id_docto = '${idDocto}'`,
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
          res.send("No hay documento");
        }
      }
    );
  });
};
// Mostrar información de un alumno por ID
AlumnosAdminCtr.showByIdTitul = async (req = request, res = response) => {
  const titulaciones = await Alumno.findById(req.params.id);
  let image = "data:image/jpeg;base64, ";

  firebird.attach(options, function (err, db) {
    if (err) throw err;

    db.query(
      `select fotografia from alumnos where matricula = '${titulaciones?.MATRICULA}'`,
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
                ...titulaciones,
                image,
              };
              res.render("admin/alumnos/alumnos/Titulacion/titulacion-id", newAlumno);

              db.detach();
            });
          });
        } else {
          res.render("admin/alumnos/alumnos/Titulacion/titulacion-id", titulaciones);
        }
      }
    );
  });
};

AlumnosAdminCtr.updateTitul = async (req = request, res = response) => {
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
    // TÍTULO LICENCIATURA
    folio_titlic: body?.folio_titlic,
    libro_titlic: body?.libro_titlic,
    foja_titlic: body?.foja_titlic,
    // CERTIFICADO LICENCIATURA
    folio_cerlic: body?.folio_cerlic,
    libro_cerlic: body?.libro_cerlic,
    foja_cerlic: body?.foja_cerlic,
    // ACTA EXENCIÓN LICENCENCIATURA
    folio_aexlic: body?.folio_aexlic,
    libro_aexlic: body?.libro_aexlic,
    foja_aexlic: body?.foja_aexlic,
    //SERVICIO SOCIAL LICENCIATURA
    folio_csslic: body?.folio_csslic,
    libro_csslic: body?.libro_csslic,
    foja_csslic: body?.foja_csslic,
    //NOTAS--->format JSON
    adicionales: body?.adicionales,
  };

  await Alumno.findByIdAndUpdate(body?.matricula, data);

  res.redirect(`/titulaciones/${body?.matricula}`);
};

AlumnosAdminCtr.updatePhotoTitul = async (req = request, res = response) => {
  let id = req.params.id;

  if (req.files?.fotografia) {
    await Alumno.findByIdAndUpdate(id, {
      fotografia: req.files.fotografia.data,
    });
    res.redirect(`/titulaciones/${id}`);
  } else {
    res.redirect(`/titulaciones/${id}`);
  }
};

AlumnosAdminCtr.doctosTitul = async (req = request, res = response) => {
  const titulaciones = await Alumno.findById(req.params.id);
  res.render("alumno/documentos/doctos-screen", {
    numeroalumno: titulaciones?.NUMEROALUMNO,
    nombre: titulaciones?.NOMBRE,
  });
};

AlumnosAdminCtr.boletasTitul = async (req, res) => {
  const titulaciones = await Alumno.findById(req.params.id);
  res.render("alumno/boletas/boletas-screen", titulaciones);
};































// TITULACIÓN formato TSU
AlumnosAdminCtr.createViewTSU = (req, res) => {
  res.render("admin/alumnos/alumnos/TSU/Tsu-crear");
};
// Mostrar listado de Titulaciones
AlumnosAdminCtr.showTSU = (req, res) => {
  const { search } = req.query;
  res.render("admin/alumnos/alumnos/TSU/Tsu-lista", { search });
};
// Mostrar documento de Titulación
AlumnosAdminCtr.showDoctoTSU = async (req, res) => {
  const { id, idDocto } = req.params;
  const tsu = await Alumno.findById(id);

  firebird.attach(options, function (err, db) {
    if (err) throw err;

    db.query(
      `select documento from doctos where clave = '${tsu.NUMEROALUMNO}' AND id_docto = '${idDocto}'`,
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
          res.send("No hay documento");
        }
      }
    );
  });
};
// Mostrar información de un alumno por ID
AlumnosAdminCtr.showByIdTSU = async (req = request, res = response) => {
  const tsu = await Alumno.findById(req.params.id);
  let image = "data:image/jpeg;base64, ";

  firebird.attach(options, function (err, db) {
    if (err) throw err;

    db.query(
      `select fotografia from alumnos where matricula = '${tsu?.MATRICULA}'`,
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
                ...tsu,
                image,
              };
              res.render("admin/alumnos/alumnos/TSU/Tsu-id", newAlumno);
              db.detach();
            });
          });
        } else {
          res.render("admin/alumnos/alumnos/TSU/Tsu-id", tsu);
        }
      }
    );
  });
};

AlumnosAdminCtr.updateTSU= async (req = request, res = response) => {
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


    //licencitura TSU
    folio_titulo_tsu: body?.folio_titulo_tsu,
    libro_titulo_tsu: body?.libro_titulo_tsu,
    fojas_titulo_tsu: body?.fojas_titulo_tsu,
    //certificado TSU
    folio_certificado_tsu: body?.folio_certificado_tsu,
    libro_certificado_tsu: body?.libro_certificado_tsu,
    fojas_certificado_tsu: body?.fojas_certificado_tsu,
    //SERVICIO SOCIAL TSU
    folio_css: body?.folio_css,
    libro_css: body?.libro_css,
    fojas_css: body?.fojas_css,
    // ACTA EXENCIÓN TSU
    folio_cex: body?.folio_cex,
    libro_cex: body?.libro_cex,
    fojas_cex: body?.fojas_cex,
    
     

    adicionales: body?.adicionales,
  };

  await Alumno.findByIdAndUpdate(body?.matricula, data);

  res.redirect(`/tsu/${body?.matricula}`);
};

AlumnosAdminCtr.updatePhotoTSU = async (req = request, res = response) => {
  let id = req.params.id;

  if (req.files?.fotografia) {
    await Alumno.findByIdAndUpdate(id, {
      fotografia: req.files.fotografia.data,
    });
    res.redirect(`/tsu/${id}`);
  } else {
    res.redirect(`/tsu/${id}`);
  }
};

AlumnosAdminCtr.doctosTSU = async (req = request, res = response) => {
  const alumno = await Alumno.findById(req.params.id);
  res.render("alumno/documentos/doctos-screen", {
    numeroalumno: tsu?.NUMEROALUMNO,
    nombre: tsu?.NOMBRE,
  });
};

AlumnosAdminCtr.boletasTSU = async (req, res) => {
  const tsu = await Alumno.findById(req.params.id);
  res.render("alumno/boletas/boletas-screen", tsu);
};


















///////////////////////////////PASSWORD////////////////////////////////////////////////////////////


// TITULACIÓN formato TSU
AlumnosAdminCtr.createViewPassword = (req, res) => {
  res.render("admin/alumnos/alumnos/Password/password-crear");
};
// Mostrar listado de Titulaciones
AlumnosAdminCtr.showPassword = (req, res) => {
  const { search } = req.query;
  res.render("admin/alumnos/alumnos/Password/password-lista", { search });
};
// Mostrar documento de Titulación
AlumnosAdminCtr.showDoctoPassword = async (req, res) => {
  const { id, idDocto } = req.params;
  const password = await Alumno.findById(id);

  firebird.attach(options, function (err, db) {
    if (err) throw err;

    db.query(
      `select documento from doctos where clave = '${password.NUMEROALUMNO}' AND id_docto = '${idDocto}'`,
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
          res.send("No hay documento");
        }
      }
    );
  });
};
// Mostrar información de un alumno por ID
AlumnosAdminCtr.showByIdPassword = async (req = request, res = response) => {
  const password = await Alumno.findById(req.params.id);
  let image = "data:image/jpeg;base64, ";

  firebird.attach(options, function (err, db) {
    if (err) throw err;

    db.query(
      `select fotografia from alumnos where matricula = '${password?.MATRICULA}'`,
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
                ...password,
                image,
              };
              res.render("admin/alumnos/alumnos/Password/password-id", newAlumno);
              db.detach();
            });
          });
        } else {
          res.render("admin/alumnos/alumnos/Password/password-id", password);
        }
      }
    );
  });
};

AlumnosAdminCtr.updatePassword = async (req = request, res = response) => {
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
    alumno_password: body?.alumno_password,

    adicionales: body?.adicionales,
  };

  await Alumno.findByIdAndUpdate(body?.matricula, data);

  res.redirect(`/password/${body?.matricula}`);
};

AlumnosAdminCtr.updatePhotoPassword = async (req = request, res = response) => {
  let id = req.params.id;

  if (req.files?.fotografia) {
    await Alumno.findByIdAndUpdate(id, {
      fotografia: req.files.fotografia.data,
    });
    res.redirect(`/password/${id}`);
  } else {
    res.redirect(`/password/${id}`);
  }
};

AlumnosAdminCtr.doctosPassword = async (req = request, res = response) => {
  const password = await Alumno.findById(req.params.id);
  res.render("alumno/documentos/doctos-screen", {
    numeroalumno: password?.NUMEROALUMNO,
    nombre: password?.NOMBRE,
  });
};

AlumnosAdminCtr.boletasPassword = async (req, res) => {
  const password = await Alumno.findById(req.params.id);
  res.render("alumno/boletas/boletas-screen", password);
};

















/////////////////Formato Profesores/////////////////

AlumnosAdminCtr.createViewprofesor = (req, res) => {
  res.render("admin/alumnos/alumnos/Profesor_view/profesor-crear");
};

AlumnosAdminCtr.showprofesor = (req, res) => {
  const { search } = req.query;
  res.render("admin/alumnos/alumnos/Profesor_view/profesor-lista", { search });
};


AlumnosAdminCtr.showDoctoprofesor = async (req, res) => {
  const { id, idDocto } = req.params;
  const profesores = await Alumno.findById(id);

  firebird.attach(options, function (err, db) {
    if (err) throw err;

    db.query(
      `select documento from doctos 
        where clave = '${profesores.NUMEROALUMNO}' AND id_docto = '${idDocto}'`,
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

AlumnosAdminCtr.showByIdprofesor = async (req = request, res = response) => {
  const profesores = await Alumno.findById(req.params.id);
  let image = "data:image/jpeg;base64, ";

  firebird.attach(options, function (err, db) {
    if (err) throw err;

    db.query(
      `select fotografia from alumnos where matricula = '${profesores?.MATRICULA}'`,
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
                ...profesores,
                image,
              };
              res.render("admin/alumnos/alumnos/Profesor_view/profesor-id", newAlumno);

              db.detach();
            });
          });
        } else {
          res.render("admin/alumnos/alumnos/Profesor_view/profesor-id", profesores);
        }
      }
    );
  });
};

AlumnosAdminCtr.updateprofesor = async (req = request, res = response) => {
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
  



    //Estadisticos

    beca: body?.beca,
    peso_kg: body?.peso_kg,
    talla: body?.talla,
    contacto: body?.contacto,
    parentesto_contacto: body?.parentesto_contacto,
    tel_contacto: body?.tel_contacto,
    tipo_seg_med: body?.tipo_seg_med,
    num_imss: body?.num_imss,
    num_imss_verificador: body?.num_imss_verificador,
    lenguaindigena: body?.lenguaindigena,
    discapacidad: body?.discapacidad,
    enfernedad: body?.enfernedad,
    alergias: body?.alergias,
    nombrepadre: body?.nombrepadre,
    nombremadre:  body?.nombremadre,
    escolaridadpadre: body?.escolaridadpadre,
    escolaridadmadre: body?.escolaridadmadre,
    actividadpadre: body?.actividadpadre,
    actividadmadre: body?.actividadmadre,
    automovilfamiliar: body?.automovilfamiliar,
    computadora: body?.computadora,
    tamanocasa: body?.tamanocasa,
    infresofamiliar: body?.infresofamiliar,
    personasdependeningreso: body?.personasdependeningreso,
    vivenencasa: body?.vivenencasa,
    hermanos: body?.hermanos,
    
    lugarnacimiento: body?.lugarnacimiento,
    hermanosestudian: body?.hermanosestudian,
    trabajas: body?.trabajas,
    actividadtrabajas: body?.actividadtrabajas,
    horariotrabajo: body?.horariotrabajo,
    estadocivil: body?.estadocivil,
    nombreconyuge: body?.nombreconyuge,
    escolaridadconyuge: body?.escolaridadconyuge,
    actividadconyuge: body?.escolaridadconyuge,
    hijos0a5: body?.hijos0a5,



    //Titulacion TSU
    inicio_egreso: body?.inicio_egreso,
    folio_titulacion: body?.folio_titulacion,
    fecha_tramite: body?.fecha_tramite,
    rev_doc_titulacion: body?.rev_doc_titulacion,
    titulacion_an: body?.titulacion_an,
    titulacion_cb: body?.titulacion_cb,
    titulacion_na: body?.titulacion_na,
    titulacion_cle: body?.titulacion_cle,
    titulacion_cai: body?.titulacion_cai,
    titulacion_curp: body?.titulacion_curp,
    titulacion_fotoS: body?.titulacion_fotoS,
    titulacion_pago: body?.titulacion_pago,
    titulacion_foliopago: body?.titulacion_foliopago,
    estadia: body?.estadia,//etiqueda TSU 
    empresa: body?.empresa,
    empresa_nr: body?.empresa_nr,
    asesor_empresarial: body?.asesor_empresarial,
    asesor_empresarial_int: body?.asesor_empresarial_int,
    estadia_inicio: body?.estadia_inicio,
    estadia_termino: body?.estadia_termino,
    carta_liberacion_emision:  body?.carta_liberacion_emision,



    //Titulacion LIC
    fecha_tramite_lic:body?.fecha_tramite_lic,
    tic_lic_an: body?.tic_lic_an,
    tit_lic_cb: body?.tic_lic_cb,
    no_adeudo_lic: body?.no_adeudo_lic,
    liberacion_lic: body?.liberacion_lic,
    autorizacion_imp_lic: body?.autorizacion_imp_lic,
    curp_lic: body?.curp_lic,
    fotografias_lic: body?.fotografias_lic,
    pago_titulacion_lic: body?.pago_titulacion_lic,
    folio_pago_tit_lic: body?.folio_pago_tit_lic,
    cedula_tsu: body?.cedula_tsu,
    num_cedula_tsu: body?.num_cedula_tsu,
    empresa_estadia_lic: body?.empresa_estadia_lic,
    asesor_empresarial_lic: body?.asesor_empresarial_lic,
    fecha_inicio_est_lic: body?.fecha_inicio_est_lic,
    fecha_final_est_lic: body?.fecha_final_est_lic,
    fecha_liberacion_est_lic: body?.fecha_liberacion_est_lic,
    fecha_autorizacion_lic: body?.fecha_autorizacion_lic,
    asesor_acad_lic: body?.asesor_acad_lic,
    fin_tramite_lic: body?.fin_tramite_lic,
    folio_titulacion_lic: body?.folio_titulacion_lic,


    //Folios LIC
    folio_cerlic: body?.folio_cerlic,
    libro_cerlic: body?.libro_cerlic,
    foja_cerlic: body?.foja_cerlic,
    
    folio_aexlic: body?.folio_aexlic,
    libro_aexlic: body?.libro_aexlic,
    foja_aexlic: body?.foja_aexlic,

    folio_csslic: body?.folio_csslic,
    libro_csslic: body?.libro_csslic,
    foja_csslic: body?.foja_csslic,
    
    folio_titlic: body?.folio_titlic,
    libro_titlic: body?.libro_titlic,
    foja_titlic: body?.foja_titlic,



    //Folios TSU
    folio_certificado_tsu: body?.folio_certificado_tsu,
    libro_certificado_tsu: body?.libro_certificado_tsu,
    fojas_certificado_tsu: body?.fojas_certificado_tsu,

    folio_titulo_tsu: body?.folio_titulo_tsu,
    libro_titulo_tsu: body?.libro_titulo_tsu,
    fojas_titulo_tsu: body?.fojas_titulo_tsu,

    folio_css: body?.folio_css,
    libro_css: body?.libro_css,
    fojas_css: body?.fojas_css,

    folio_cex: body?.folio_cex,
    libro_cex: body?.libro_cex,
    fojas_cex: body?.fojas_cex,

  };

  await Alumno.findByIdAndUpdate(body?.matricula, data);

  res.redirect(`/profesores/${body?.matricula}`);
};

AlumnosAdminCtr.updatePhotoprofesor = async (req = request, res = response) => {
  let id = req.params.id;

  if (req.files?.fotografia) {
    await Alumno.findByIdAndUpdate(id, {
      fotografia: req.files.fotografia.data,
    });
    res.redirect(`/profesores/${id}`);
  } else {
    res.redirect(`/profesores/${id}`);
  }
};

AlumnosAdminCtr.doctosprofesor = async (req = request, res = response) => {
  const profesores = await Alumno.findById(req.params.id);
  res.render("alumno/documentos/doctos-screen", {
    numeroalumno: profesores?.NUMEROALUMNO,
    nombre: profesores?.NOMBRE,
  });
};

AlumnosAdminCtr.boletasprofesor = async (req, res) => {
  const profesores = await Alumno.findById(req.params.id);
  res.render("alumno/boletas/boletas-screen", profesores);
};






module.exports = {
  AlumnosAdminCtr,
};
