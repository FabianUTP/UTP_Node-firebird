const express = require("express");

const router = express.Router();
const { GruposCtr } = require('../app/controllers')

router.get("/grupos", GruposCtr.getAll)

router.get("/cuatrimestres", GruposCtr.getCuatris);

router.put("/update/CuatriXGrupos", GruposCtr.updateCuatriGrupo)

module.exports = router;
