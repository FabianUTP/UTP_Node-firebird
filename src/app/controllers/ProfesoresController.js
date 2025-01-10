const { request } = require("express");
const { Profesores, Planes_Eval } = require("../models");


const ProfeCtr = {};

ProfeCtr.showList = (req, res) => {
  res.render("admin/profes/profesores-list");
};

ProfeCtr.showById = async (req, res) => {
  const { id } = req.params;
  const profe = await Profesores.findById(id);
  res.render("admin/profes/profesores-id", profe);
};


ProfeCtr.update_ficha = async (req, res) => {
  const { id } = req.params;
  const data = {
    claveprofesor: req.body.clave_profesor,
    numempleado: req.body.numero_empleado,
    nombreprofesor: req.body.nombre,
    genero: req.body.genero,
    numero_seguridadsocial: req.body.seguro_social,
    cedula_fiscal: req.body.cedula,
    clave_ciudadana: req.body.clave_ciudadana,
    estado_civil: req.body.estado_civil,
    fecha_nacimiento: req.body.nacimiento,
    lugar_nacimiento: req.body.lugar_nacimiento,
    estado_nacimiento: req.body.estado_nacimiento,
    nacionalidad: req.body.nacionalidad,
    domicilio: req.body.domicilio,
    cp: req.body.cp,
    ciudad: req.body.ciudad,
    estado: req.body.estado,
    celular: req.body.celular,
    telefono: req.body.telefono,
    telefono_oficina: req.body.tel_ofi,
    email: req.body.correo_electronico,
    nivel_estudios: req.body.nivel_edu,
    statusactual: req.body.estatus_act,
    fecha_ingreso: req.body.fech_ingreso,
  };

  await Profesores.findByIdAndUpdate(id, data);

  res.redirect(`/profesores/${id}`);
};

ProfeCtr.update_otros_campos = async (req, res) => {
  const { id } = req.params;
  const data = {
    departamento: req.body.departamento,
    cargo: req.body.cargo_desempeñar,
    contrato: req.body.tipo_contrato,
    nivel_estudios: req.body.niv_estudios,
    institucion_estudios: req.body.instituto_estudios,
    cedula_profesional: req.body.cedula_prof,
    documento_migratorio: req.body.doc_migratorio,
    especialidad: req.body.especialidad,
    horasadministrativas: req.body.horas_admin,
    horasinvestigacion: req.body.horas_inv,
    horasdocencia: req.body.horas_docencia,
    sueldo: req.body.sueldo_asig,
  };

  await Profesores.findByIdAndUpdate(id, data);

  res.redirect(`/profesores/${id}`);
};

ProfeCtr.update_personalizados = async (req, res) => {
  const { id } = req.params;
  const data = {
    cuerposacademicos: req.body.cuerpos_Academ,
    PROMEP: req.body.PROMEP,
    tipo_sangre: req.body.tipo_sangre,
    contacto: req.body.persona_contacto,
    patentesco_contacto: req.body.parentesco_contac,
    tel_contacto: req.body.tel_contac,
    departamento: req.body.area_dep,
    direccion: req.body.direccion,
    puesto: req.body.puesto,
    password: req.body.password,
    // cred_folio: req.body.folio_credencial,
    // cred_numero: req.body.num_credencial,
    // numempleado: req.body.num_empleado,
  };

  await Profesores.findByIdAndUpdate(id, data);

  res.redirect(`/profesores/${id}`);
};

ProfeCtr.showAsig = async (req, res) => {
  const idProfesor = req.params.id;
  const profe = await Profesores.findById(idProfesor);
  res.render("admin/profes/asig/profes-asig-id", profe);
};

ProfeCtr.showPerfil = (req, res) => {
  res.render("admin/profes/asig/profes-perfil");
};



ProfeCtr.showSubirCalf = async (req, res) => {
  const idProfesor = req.params.id;
  const { idPlan } = req.query;

  const profe = await Profesores.findById(idProfesor);
  const evals = await Planes_Eval.where(
    { id_plan: [idPlan] },
    { strict: true }
  );
  res.render("admin/profes/cal/subir_calif", { profe, evals });
};

ProfeCtr.showVerCalf = async (req = request, res) => {
  const idProfesor = req.params.id;
  const { idPlan } = req.query;

  const profe = await Profesores.findById(idProfesor);
  const evals = await Planes_Eval.where(
    { id_plan: [idPlan] },
    { strict: true }
  );

  res.render("admin/profes/cal/ver_calif", { profe, evals });
};

module.exports = {
  ProfeCtr,
};
