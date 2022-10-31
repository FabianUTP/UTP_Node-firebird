const NivelesCtr = {};

NivelesCtr.show = (req, res) => {
  res.render("admin/carreras/carreras-screen");
};

NivelesCtr.form = (req, res) => {
  res.render("admin/carreras/formulario-crear");
};

module.exports = {
  NivelesCtr,
};
