const { request, response, Router } = require("express");
const router = Router();

router.get('/grupos', async (req = request, res = response) => {
    const { skip = 0, limit = 10, } = req.query;
    res.json({
        querys: req.query,
        grupos: [
            {
                CODIGO_GRUPO: 'GAS-1B',
                GRADO: '1',
                GRUPO: 'B',
                INSCRITOS: '15',
                CUPO_MAXIMO: '30',
                CLAVEPROFESOR_TITULAR: '34jh',
            },
            {
                CODIGO_GRUPO: 'GAS-1B',
                GRADO: '1',
                GRUPO: 'B',
                INSCRITOS: '15',
                CUPO_MAXIMO: '30',
                CLAVEPROFESOR_TITULAR: '34jh',
            },
            {
                CODIGO_GRUPO: 'GAS-1B',
                GRADO: '1',
                GRUPO: 'B',
                INSCRITOS: '15',
                CUPO_MAXIMO: '30',
                CLAVEPROFESOR_TITULAR: '34jh',
            },
            {
                CODIGO_GRUPO: 'GAS-1B',
                GRADO: '1',
                GRUPO: 'B',
                INSCRITOS: '15',
                CUPO_MAXIMO: '30',
                CLAVEPROFESOR_TITULAR: '34jh',
            },
        ]
    });
});

module.exports = router;