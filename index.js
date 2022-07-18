const express = require('express');
const { getData } = require('./src/databases/firebird-connection');
const app = express();
require('dotenv');


app.get('/', async (req, res) => {

    let alumnos = await getData('profesores');

    res.json(alumnos)
});

app.listen(3000, () => {
    console.log('escuchando en el puerto 3000');
})