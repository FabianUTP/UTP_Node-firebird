const Firebird = require("node-firebird");
const options = require("../../configs/credential-firebird");

const GruposalumnosController = {};

GruposalumnosController.obtenerGrupos = async (req, res) => {
  try {
    // Obtén el nivel seleccionado del query string
    const nivel = req.query.nivel;
    const inicial = req.query.inicial;
    const final = req.query.final;

    // Construye la consulta SQL para obtener los grupos del nivel seleccionado
    const query =
      'SELECT CODIGO_GRUPO FROM GRUPOS WHERE NIVEL = ? AND INICIAL = ? AND FINAL = ? AND PERIODO = 0';
    const result = await executeQuery(query, [nivel, inicial, final]);

    // Envía los grupos correspondientes como respuesta
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener datos de la base de datos' });
  }
};

function executeQuery(ssql, params) {
  return new Promise((resolve, reject) => {
    Firebird.attach(options, (err, db) => {
      if (err) {
        reject(err);
        return;
      }

      db.query(ssql, params, (err, result) => {
        db.detach();
        if (err) {
          reject(err);
          return;
        }

        resolve(result);
      });
    });
  });
}

module.exports = {GruposalumnosController};
