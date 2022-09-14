# Este proyecto es creado con el ambiente de NodeJS, para ello, es necesario tener instalado Node version 15 o superior.

# Dependencias

 Para poder correr el proyecto es necesario instalar las dependencias que requiere el proyecto, para ello, es necesario hacer los siguientes comandos en consola.

#

## Descargar dependencias del proyecto (Solo una vez)
    npm install

## Correr el proyecto (Cada vez que se desee trabajar)
    npm run dev


# Enlaces a documentaciones necesarias
 * [Express - Declarando rutas](http://expressjs.com/es/starter/basic-routing.html)
 * [Express Session - Para el manejo de las sesiones](https://www.npmjs.com/package/express-session)
 * [Express - Creacion de Middlewares](https://expressjs.com/es/guide/using-middleware.html)
 * [Handlebars - Motor de plantillas para las vitas](https://www.npmjs.com/package/express-handlebars)
 * [Conexion a Firebird](https://www.npmjs.com/package/node-firebird)
 * [Bootstrap - Para el diseño y estilos](https://getbootstrap.com/docs/5.2/getting-started/introduction/)


# Creando una nueva ruta
 Para crear una nueva ruta en la web, es necesario colocarse en el archivo de **routes.js**, que se encuentra en en la ruta de **src/routes/routes.js**.


 ```js
    route.get('/nombre-de-la-ruta', (req, res) => res.render('nombre-vista'));
 ```

Donde **/nombre-de-la-ruta** es el nombre de la ruta que desea declarar, ejemplo **/perfil**, de igual forma, puede agregar más paths, ejemplo **/perfil/direccion** o **/perfil/direccion/editar**, a libre elección siguiendo el patron que se desee.

Ahora, **nombre-vista**, es el nombre del archivo donde esta la vista que se desea mostrar, las vistas se almacenan dentro de la ruta **src/views/** con la extención **.hbs** en lugar de **.html**

Si el arhcivo esta dentro de una carpeta o más, entonces solo se coloca el nombre de la carpeta seguido del nombre del arhivo, ejemplo:

 ```js
    route.get('/login', (req, res) => res.render('auth/login'));
 ```

 Donde **/login** es mi ruta declarada y **auth/login** es la ruta donde se encuentra el archivo de la vista.


#  
Mi recomendacon es trabajar con el editor de codigo **Visual Studio Code**.