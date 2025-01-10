const Firebird = require('./Firebird');
const Doctos = require('./Doctos'); // Importa el modelo Doctos

class CFGDoctos extends Firebird {
  constructor() {
    super('cfgdoctos', 'id_docto');
  }

  // Método para obtener los documentos relacionados
  async getDocumentosRelacionados() {
    const doctosId = this.result[0].ID_DOCOS; // Supongo que obtienes la ID_DOCOS de algún lugar
    const documentos = await Doctos.query().where('ID_DOCTO', doctosId);
    return documentos;
  }
}

const cfgDoctos = new CFGDoctos();
module.exports = cfgDoctos;
