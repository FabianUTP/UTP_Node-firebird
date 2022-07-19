const express = require('express');
const app = express();
require('dotenv');

// Plantillas Handlebars
app.set('view engine', 'hbs');

// Aqui se definen las rutas
app.use(require('./routes/routes'));


// Aqui se levanta el servidor y se define el puerto
app.listen(3000, () => {
    console.log('escuchando en el puerto 3000');
})