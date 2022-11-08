const GruposCtr = {};

GruposCtr.show = (req, res) => {
  res.render('admin/alumnos/grupos/grupos-list');
};

GruposCtr.showById = (req, res) => {
  res.render('admin/alumnos/grupos/grupo-detail', {
    codigo_grupo: req.params.idGrupo
  })
};

module.exports = {
  GruposCtr
};