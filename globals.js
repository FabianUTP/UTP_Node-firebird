// Aquí se pueden de definir variables visibles que se usarán en el proyecto
// Ten cuidado al cambiar las variables locales, ya que afecta todas las funciones que lo utilizan

const globals = (req, res, next) => {
  // Mensajes de retorno html
  res.locals.msj_error = req.flash("msj_error");
  res.locals.msj_good = req.flash("msj_good");

  // Variables globales para mostrar en la web (de la sesión)
  const sessionData = [
    'isAuthenticated', 'IDAuth', 'nameAuth', 'lastNameAuth',
    'isAdmin', 'isAlumno', 'isProfe', 'isAspirante'
  ];

  // Asigna las variables de sesión a res.locals
  sessionData.forEach((key) => {
    res.locals[key] = req.session[key];
  });

  next();
};

module.exports = globals;
