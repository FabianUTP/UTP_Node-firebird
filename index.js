const express = require('express');
const { engine } = require('express-handlebars');
const app = express();

const path = require('path');
require('dotenv');

// Configuracion de plantillas Handlebars
app.set('views', path.join(__dirname, 'views'));
app.engine('hbs', engine({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'layouts'),
    extname: '.hbs'
}));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, '/public/')));

// Aqui se definen las rutas
app.use(require('./routes/routes'));

// Aqui se levanta el servidor y se define el puerto
let port = 3080;
app.listen(port, () => {
    console.log('Servidor corriendo en el puerto ' + port);
})