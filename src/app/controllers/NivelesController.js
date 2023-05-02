const NivelesCtr = {};

NivelesCtr.show = (req, res) => {
  res.render("admin/config_general/carreras/carreras-list");
};

NivelesCtr.form = (req, res) => {
  res.render("admin/config_general/carreras/carreras-crear");
};

module.exports = {
  NivelesCtr,
};
