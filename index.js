const express = require('express');
const { engine } = require('express-handlebars');
const path = require('path');
const methdoOverride = require('method-override');

require('dotenv');

const app = express();

// Configuracion de plantillas Handlebars
app.set('views', path.join(__dirname, 'views'));            // Definiendo las rutas de las vistas
app.engine('hbs', engine({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),     // Definiendo la vista principal
    partialsDir: path.join(app.get('views'), 'layouts'),    // Definiendo las extenciones para la vista principal
    extname: '.hbs'                                         // Definiendo la extencion para las vistas
}));
app.set('view engine', 'hbs');

// Definiendo la ruta para acceder en los archivos desde las etiquetas html
app.use(express.static(path.join(__dirname, '/public/')));


// Middlewares
app.use(express.json());
app.use(methdoOverride('_method'))

// Aqui se definen las rutas
app.use(require('./routes/routes'));

// Aqui se levanta el servidor y se define el puerto
let port = 3080;
app.listen(port, () => {
    console.log('Servidor corriendo en el puerto ' + port);
})