const { request, response } = require("express");
const { Alumno, ProfeAuth, Aspirante, Usuarios } = require("../models");
const { user } = require("../../configs/credential-firebird");
const bcrypt = require('bcrypt'); // Importa bcrypt para comparar contraseñas

const AuthController = {};

// Renderiza la vista de login
AuthController.login = (req, res) => res.render("auth/login");


// Autenticación de alumnos
AuthController.authAlumno = async (req = request, res = response) => {
  const { user, password } = req.body;

  try {
    // Buscar al alumno por matrícula
    const alumno = await Alumno.findById(user);

    // Si no se encuentra al alumno, redirigir con mensaje de error
    if (!alumno) {
      req.flash('msj_error', 'Alumno no encontrado');
      return res.redirect('/login');
    }

    // Si el estado del alumno es "S" (suspendido), denegar el acceso
    if (alumno.STATUS.trim() === "S") {
      req.flash('msj_error', 'No pueden ingresar los aspirantes');
      return res.redirect('/login');
    }

    console.log("MATRÍCULA:", alumno.MATRICULA);
    console.log("CONTRASEÑA EN BD:", alumno.ALUMNO_PASSWORD || "No registrada");

    // Si no hay contraseña registrada, denegar el acceso y dar instrucciones
    if (!alumno.ALUMNO_PASSWORD || alumno.ALUMNO_PASSWORD.trim() === "") {
      req.flash('msj_error', 'El alumno no tiene una contraseña registrada. Por favor, contacte con el administrador o registre su contraseña.');
      return res.redirect('/login');
    }

    // Validar que la contraseña ingresada coincida con la de la BD
    if (password !== alumno.ALUMNO_PASSWORD) {
      req.flash('msj_error', 'Contraseña incorrecta');
      return res.redirect('/login');
    }

    // Iniciar sesión si la contraseña es válida
    req.session.isAuthenticated = true;
    req.session.isAlumno = true;
    req.session.IDAuth = alumno.MATRICULA;
    req.session.nameAuth = alumno.NOMBRE;
    req.session.lastNameAuth = `${alumno.PATERNO} ${alumno.MATERNO}`;

    // Redirigir a la página principal después de un inicio de sesión exitoso
    return res.redirect('/');

  } catch (error) {
    console.error('Error en authAlumno:', error);
    req.flash('msj_error', 'Hubo un problema al procesar su solicitud');
    return res.redirect('/login');
  }
};



// Autenticacion de Aspirantes cambios para los ingresos de numeros...
AuthController.authAspirante = async (req = request, res = response) => {
  const { user } = req.body;

  try {
    // Validar que el número no esté vacío
    if (!user) {
      req.flash('msj_error', 'Por favor, ingrese su número de folio.');
      return res.redirect('/login');
    }

    // Limpiar y validar el formato del número de folio
    const sanitizedUser = user.trim();

    // Asegurar que el valor es un número válido
    if (isNaN(sanitizedUser)) {
      req.flash('msj_error', 'El folio debe ser un número válido.');
      return res.redirect('/login');
    }

    // Buscar aspirante por el número de folio
    const aspirante = await Aspirante.findById(sanitizedUser);

    // Verificar si el folio no existe
    if (!aspirante) {
      req.flash('msj_error', 'Folio de aspirante no encontrado.');
      return res.redirect('/login');
    }

    // Verificar si el estatus no permite el acceso
    if (aspirante.STATUS.trim() !== "S") {
      req.flash('msj_error', 'Ya no puede ingresar con el folio proporcionado.');
      return res.redirect('/login');
    }

    // Configurar la sesión
    req.session.regenerate((err) => {
      if (err) {
        console.error('Error regenerando la sesión:', err);
        req.flash('msj_error', 'Error al iniciar sesión.');
        return res.redirect('/login');
      }

      req.session.isAuthenticated = true;
      req.session.isAspirante = true;
      req.session.IDAuth = aspirante.NUMEROALUMNO;
      req.session.nameAuth = aspirante.NOMBRE;
      req.session.lastNameAuth = aspirante.PATERNO;

      return res.redirect('/');
    });
  } catch (error) {
    console.error('Error en authAspirante:', error.message);
    req.flash('msj_error', 'Hubo un problema al procesar su solicitud. Inténtelo de nuevo más tarde.');
    return res.redirect('/login');
  }
};




// Autenticación de profesores
AuthController.authProfe = async (req = request, res = response) => {
  const { user, password } = req.body;

  try {
    // Buscar al profesor por clave de profesor
    const profesor = await ProfeAuth.findById(user);

    // Si no se encuentra al profesor, redirigir con mensaje de error
    if (!profesor) {
      req.flash('msj_error', 'Profesor no encontrado');
      return res.redirect('/login');
    }

    console.log("FOLIO PROFESOR:", profesor.CLAVEPROFESOR);
    console.log("CONTRASEÑA EN BD:", profesor.PASSWORD || "No registrada");

    // Si no hay contraseña registrada, denegar el acceso y dar instrucciones
    if (!profesor.PASSWORD || profesor.PASSWORD.trim() === "") {
      req.flash('msj_error', 'El profesor no tiene una contraseña registrada. Por favor, contacte con el administrador.');
      return res.redirect('/login');
    }

    // Validar que la contraseña ingresada coincida con la de la BD
    if (password !== profesor.PASSWORD) {
      req.flash('msj_error', 'Contraseña incorrecta');
      return res.redirect('/login');
    }

    // Iniciar sesión si la contraseña es válida
    req.session.isAuthenticated = true;
    req.session.isProfe = true;
    req.session.IDAuth = profesor.CLAVEPROFESOR;//Matricula del maestro 
    req.session.nameAuth = profesor.NOMBREPROFESOR;
    req.session.lastNameAuth = profesor.APELLIDOPROFESOR || ""; 

    // Redirigir a la página principal después de un inicio de sesión exitoso
    return res.redirect('/');

  } catch (error) {
    console.error('Error en authProfe:', error);
    req.flash('msj_error', 'Hubo un problema al procesar su solicitud');
    return res.redirect('/login');
  }
};


// Autenticación de administradores
AuthController.authAdmin = async (req = request, res = response) => {
  const { user, password } = req.body;

  try {
    const userData = await Usuarios.findById(user);

    if (!userData) {
      req.flash('msj_error', 'Usuario no encontrado');
      return res.redirect('/login');
    }

    if (userData.ADMINISTRADOR.trim() === "N") {
      req.flash('msj_error', 'El usuario no es administrador');
      return res.redirect('/login');
    }

    req.session.isAuthenticated = true;
    req.session.isAdmin = true;
    req.session.IDAuth = userData.EMAIL;
    req.session.nameAuth = userData.NOMBRE;
    req.session.lastNameAuth = "";

    return res.redirect('/');
  } catch (error) {
    console.error('Error en authAdmin:', error);
    req.flash('msj_error', 'Hubo un problema al procesar su solicitud');
    return res.redirect('/login');
  }
};

// Cerrar sesión
AuthController.logout = (req = request, res = response) => {
  req.session.destroy();
  res.redirect("/login");
};

module.exports = {
  AuthController,
};
