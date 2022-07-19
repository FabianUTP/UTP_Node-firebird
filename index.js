const express = require('express');
const app = express();
require('dotenv');

// Plantillas Handlebars
app.set('view engine', 'hbs');

app.use(require('./routes/routes'));

app.listen(3000, () => {
    console.log('escuchando en el puerto 3000');
})