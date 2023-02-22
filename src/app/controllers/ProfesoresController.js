const { Profesores } = require("../models");

const ProfeCtr = {}

ProfeCtr.showList = (req, res) =>{
    res.render("admin/profes/profesores-list");
}

ProfeCtr.showById = async (req, res) => {
    const { id } = req.params;
    const profe = await Profesores.findById(id);
    res.render("admin/profes/profesores-id", profe);
}

ProfeCtr.update = async (req, res) => {
    const { id } = req.params; 
    const data = {
        clave_profesor: req.body.clave_profesor,
        numero_empleado: req.body.numero_empleado,
        nombreprofesor: req.body.nombre,
        genero: req.body.genero,
        seguro_social:req.body.seguro_social,
        cedula_fiscal: req.body.cedula,
        clave_ciudadana: req.body.clave_ciudadana,
        estado_civil: req.body.estado_civil,
        fecha_nacimiento: req.body.nacimiento,
        lugar_nacimiento: req.body.lugar_nacimiento,
        estado_nacimiento: req.body.estado_nacimiento,
        nacionalidad: req.body.nacionalidad,
        domicilio : req.body.domicilio,
        cp: req.body.cp, 
        ciudad: req.body.ciudad,
        estado: req.body.estado,
        celular: req.body.celular,
        telefono: req.body.telefono,
        tel_ofi: req.body.tel_ofi,
        correo:req.body.correo_electronico,
        nivel_edu: req.body.nivel_edu,
        estatus_act: req.body.estatus_act,
        fech_ingreso: req.body.fech_ingreso,
        departamento: req.body.departamento,
        cargo_desempeñar: req.body.cargo_desempeñar,
        tipo_contrato: req.body,tipo_contrato,
        niv_estudios: req.body.niv_estudios,
        instituto_estudios: req.body.instituto_estudios,
        cedula_prof: req.body.cedula_prof,
        doc_migratorio: req.body.doc_migratorio,
        especialidad: req.body.especialidad,
        horas_admin: req.body.horas_admin,
        horas_inv: req.body.horas_inv,
        horas_docencia: req.body.horas_docencia,
        sueldo_asig: req.body.sueldo_asig,
        cuerpos_Academ:req.body.cuerpos_Academ,
        PROMEP: req.body.PROMEP,
        tipo_sangre: req.body.tipo_sangre,
        persona_contacto: req.body.persona_contacto,
        parentesco_contac: req.body.parentesco_contac,
        tel_contac: req.body.tel_contac,
        area_dep: req.body.area_dep,
        direccion: req.body.direccion,
        puesto: req.body.puesto,
        password: req.body.password,
        folio_credencial: req.body.folio_credencial,
        num_credencial: req.body.num_credencial,
        num_empleado: req.body.num_empleado,
    }

    await Profesores.findByIdAndUpdate(id, data);

    res.redirect("/profesores");
}
ProfeCtr.showAsig = (req, res) =>{
    res.render("admin/profes/asig/profes-asig-id");
}

ProfeCtr.showPerfil = (req, res) =>{
    res.render("admin/profes/asig/profes-perfil");
}

module.exports = {
    ProfeCtr,
  };