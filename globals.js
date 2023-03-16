// Aquí se pueden de definir variables visibles que se usarán en el proyecto

//cuidado al cambiar las variables, ya que afecta todas las funciones que lo utilizan

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
  res.locals.isAlumno = req.session.isAlumno;
  res.locals.isProfe = req.session.isProfe;
  res.locals.isAspirante = req.session.isAspirante;
  next();
};

module.exports = globals;