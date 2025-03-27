const { Grupos } = require("../models");

const GruposCtr = {};

const path = "admin/alumnos/grupos";

GruposCtr.show = (req, res) => {
  res.render(path + '/grupos-list');
};

GruposCtr.showAnother = (req, res) => {
  res.render(path + '/grupos-list-califi');
};

GruposCtr.showByIdAnother = async (req, res) => {
  const grupo = await Grupos.findById(req.params.idGrupo);
  res.render(path + '/grupo-detail-califi', {
    codigo_grupo: req.params.idGrupo,
    grupo
  })
};

GruposCtr.showById = async (req, res) => {
  const grupo = await Grupos.findById(req.params.idGrupo);
  res.render(path + '/grupo-detail', {
    codigo_grupo: req.params.idGrupo,
    grupo
  })
};

GruposCtr.addView = (req, res) => {
  res.render(path + "/grupo-add")
}

GruposCtr.editView = async (req, res) => {
  const grupo = await Grupos.findById(req.params.idGrupo);
  res.render(path + "/grupo-edit", grupo);
}

GruposCtr.addAlumnoView = (req, res) => {
  res.render(path + "/grupo-edit-alumno")
}





///Grupos profesores___>

const profesorespath = "admin/alumnos/alumnos/GrupoProfesor";

GruposCtr.showProfesores = (req, res) => {
  res.render(profesorespath + '/grupos-list-profe');
};

GruposCtr.showAnotherProfesores = (req, res) => {
  res.render(profesorespath + '/grupo-list-califi-profe');
};

GruposCtr.showByIdAnotherProfesores = async (req, res) => {
  const grupo = await Grupos.findById(req.params.idGrupo);
  res.render(profesorespath + '/grupo-detail-califi-profe', {
    codigo_grupo: req.params.idGrupo,
    grupo
  })
};

GruposCtr.showByIdProfesores = async (req, res) => {
  const grupo = await Grupos.findById(req.params.idGrupo);
  res.render(profesorespath + '/grupo-detail-profe', {
    codigo_grupo: req.params.idGrupo,
    grupo
  })
};

GruposCtr.addViewProfesores = (req, res) => {
  res.render(profesorespath + "/grupo-add-profe")
}

GruposCtr.editViewProfesores = async (req, res) => {
  const grupo = await Grupos.findById(req.params.idGrupo);
  res.render(profesorespath + "/grupo-edit-profe", grupo);
}

GruposCtr.addAlumnoViewProfesores = (req, res) => {
  res.render(profesorespath + "/grupo-edit-alumno-profe")
}

GruposCtr.showByIdProfesoresviews = async (req, res) => {
  const grupo = await Grupos.findById(req.params.idGrupo);
  res.render(profesorespath + '/grupo-detall-admin-format', {
    codigo_grupo: req.params.idGrupo,
    grupo
  })
};



GruposCtr.showByIdAnotherProfesoresView = async (req, res) => {
  const grupo = await Grupos.findById(req.params.idGrupo);
  res.render(path + '/grupo-detall-admin', {
    codigo_grupo: req.params.idGrupo,
    grupo
  })
};

//Generar alumnos por formato--> para subir arcivos

const adminpath = "admin/alumnos/alumnos/Alumnos_Archivos";




GruposCtr.showAnotheradmin = (req, res) => {
  res.render(adminpath + '/grupos-list-califi-admin');
};


module.exports = {
  GruposCtr
};