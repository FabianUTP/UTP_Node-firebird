const express = require("express");
const { GruposCtr, AlumnosController } = require('../app/controllers')

const router = express.Router();

router.get("/grupos", GruposCtr.getGrupos);

router.get("/cuatrimestres", GruposCtr.getCuatris);

router.put("/update/CuatriXGrupos", GruposCtr.updateCuatriGrupo);

router.get("/alumnos", AlumnosController.getAll);


module.exports = router;
