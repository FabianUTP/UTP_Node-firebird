const express = require("express");
const router = express.Router();

// Middleewares para las sesiones
const { isAdmin } = require("../app/middlewares/session");

// Controladores
const {
  GruposCtr,
  CuatrisCtr,
  NivelesCtr,
} = require("../app/controllers");

// Rutas para el Administrador
router.get("/grupos", [isAdmin], GruposCtr.show);
router.get("/grupos/:idGrupo", [isAdmin], GruposCtr.show);
router.get("/nuevo", [isAdmin], (req, res) =>
  res.render("admin/alumnos/crear-screen")
);
router.get("/alumnos", [isAdmin], (req, res) =>
  res.render("admin/alumnos/lista-screen")
);
router.get("/cuatrimestres", [isAdmin], CuatrisCtr.index);
router.get("/cuatrimestres-nuevo", [isAdmin], CuatrisCtr.showCreate);
router.post("/cuatrimestres/nuevo", [isAdmin], CuatrisCtr.create);
router.get("/cuatrimestres/:id", [isAdmin], CuatrisCtr.showById);
router.get("/carreras", [isAdmin], NivelesCtr.show);

router.get("/doctos", (req, res) => res.render("admin/doctos"));

module.exports = router;