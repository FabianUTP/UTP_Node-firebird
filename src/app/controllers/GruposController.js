const { request, response } = require("express");
const { Grupos, Ciclos } = require("../models");

const GruposCtr = {};

GruposCtr.show = (req, res) => res.render('admin/grupos/grupos-screen');

GruposCtr.showById = (req, res) => res.render('admin/grupos/grupo-detail-screen');  

GruposCtr.getGrupos = async (req = request, res = response) => {
    const { skip = 0, limit = 10, search = "" } = req.query;
  
    // Consulta SQL paar mostrar los grupos
    let query = `SELECT FIRST(${limit}) SKIP(${skip}) `;
    query +=
      "grupos.codigo_grupo, grupos.grado, grupos.grupo, grupos.cupo_maximo, grupos.inscritos, profesores.nombreprofesor as claveprofesor_titular, cfgniveles.nivel, ciclos.codigo_corto as periodo ";
    query += "FROM grupos ";
    query += "JOIN profesores ON grupos.claveprofesor_titular = profesores.claveprofesor "
    query += "JOIN cfgniveles ON grupos.nivel = cfgniveles.nivel ";
    query += "JOIN ciclos ON grupos.periodo = ciclos.periodo "
  
    // Si hay palabras a bsucar, lo agrega en la consulta
    if (search.length > 0) {
      query += `WHERE (grupos.codigo_grupo LIKE '%${search.toLocaleUpperCase()}%') `;
    }
  
    // Si hay periodo seleecionado a mostrar lo agrega en la query
    if(req.session.periodoGrupoName) {
      query += `AND (ciclos.descripcion = '${req.session.periodoGrupoName}')`
    }
  
    const grupos = await Grupos.createQuery(query);
  
    res.json({
      querys: {
        skip,
        limit,
        search
      },
      periodo: req.session.periodoGrupo,
      grupos,
    });
}

GruposCtr.getCuatris = async (req = request, res = response) => {
    const ciclos = await Ciclos.where({
      periodo: [1, 2, 3],
    });
  
    res.json({
      periodoSelected: req.session.periodoGrupoName,
      ciclos,
    });
  }

GruposCtr.updateCuatriGrupo = async (req, res) => {
    const { periodo } = req.body;
  
    // Actualiza el periodo a mostrar en la API de grupos
    if(periodo === "none") {
      // req.session.periodoGrupo = null;
      req.session.periodoGrupoName = null;
    } else {
      // req.session.periodoGrupo = periodo
      req.session.periodoGrupoName = periodo
    }
  
    res.json({
      res: "Periodo actualizado",
    })
  }

module.exports = {
    GruposCtr
};