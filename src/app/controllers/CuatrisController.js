const { response, request } = require("express");
const { Ciclos } = require("../models");

const CuatrisCtr = {};

CuatrisCtr.index = (req = request, res = response) => {
  req.flash("msj_good", "Se guardo un nuevo ciclo exitosamente");
  res.render("admin/cuatrimestres/cuatris-screen");
};

CuatrisCtr.showCreate = (req = request, res = response) => {
  res.render("admin/cuatrimestres/add-cuatri-screen");
}

CuatrisCtr.create = async (req = request, res = response) => {
  const data = req.body;

  const validaExistencia = await Ciclos.findById(data.codigo_corto);

  if(validaExistencia !== null) {
    return res.json({
      msj: 'Ya existe ese codigo, intente con otro',
      data: validaExistencia
    })
  }

  const addNew = {
    id_escuela: 1,
    inicial: data.inicial,
    final: data.final,
    periodo: data.periodo,
    descripcion: req.descripcion,
    codigo_corto: data.codigo_corto,
    fecha_inicial: data.fecha_inicial,
    fecha_final: data.fecha_final,
    incluir_procesos: 'S',
    mostrar_barra: 'N',
    mostrar_webges: 'N'
  };

  await Ciclos.create(addNew);
  req.flash("msj_good", "Se guardo un nuevo ciclo exitosamente");
  res.redirect("/cuatrimestres");
}

CuatrisCtr.showById = async (req = request, res = response) => {
  const ciclo = await Ciclos.findById(req.params.id)
  // res.json(ciclo)
  res.render("admin/cuatrimestres/info-cuatri-screen", { ciclo });
}

module.exports = {
  CuatrisCtr,
}