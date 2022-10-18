// Aqui se pueden de definir variables visibles que se usuaran en el proyecto

//cuidado al cambiar las vairables, ya que afecta todas las funciones que lo utilizan

const globals = (req, res, next) => {
  // Mensajes de retorno html
  res.locals.msj_error = req.flash("msj_error");
  res.locals.msj_good = req.flash("msj_good");

  // Variables globales para mostrar en la web
  res.locals.isAuthenticated = req.session.isAuthenticated;
  res.locals.IDAuth = req.session.IDAuth;
  res.locals.nameAuth = req.session.nameAuth;
  res.locals.lastNameAuth = req.session.lastNameAuth;
  res.locals.isAdmin = req.session.isAdmin;
  next();
};

module.exports = globals;