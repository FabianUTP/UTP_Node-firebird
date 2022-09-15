const GruposCtr = {};

GruposCtr.show = (req, res) => res.render('admin/grupos/grupos-screen');

GruposCtr.showById = (req, res) => res.render('admin/grupos/grupo-detail-screen');  

module.exports = GruposCtr;