# Este proyecto es creado con el ambiente de NodeJS, para ello, es necesario tener instalado Node version 15 o superior.

Mi recomendacon es trabajar con el editor de codigo **Visual Studio Code**.

#
# Dependencias

Para poder correr el proyecto es necesario instalar las dependencias que requiere el proyecto, para ello, es necesario hacer los siguientes comandos en consola.

#  


## Descargar dependencias del proyecto (Solo una vez)
    $ npm install

## Correr el proyecto (Cada vez que se desee trabajar)
    $ npm run dev


# Enlaces a documentaciones necesarias
 * [Express Session - Para el manejo de las sesiones](https://www.npmjs.com/package/express-session)
 * [Express - Declarando rutas](http://expressjs.com/es/starter/basic-routing.html)
 * [Express - Creacion de Middlewares](https://expressjs.com/es/guide/using-middleware.html)
 * [Handlebars - Motor de plantillas para las vitas](https://www.npmjs.com/package/express-handlebars)
 * [Conexion a Firebird](https://www.npmjs.com/package/node-firebird)
 * [Bootstrap - Para el diseño y estilos](https://getbootstrap.com/docs/5.2/getting-started/introduction/)
 * [Bootstrap Icons - Para lso iconos](https://icons.getbootstrap.com)

# Creando una nueva ruta
 Para crear una nueva ruta en la web, es necesario saber si la ruta sera para el **Administrador** o para el **Alumno** colocarse en la carpeta **routes**, y ahi se elige el archivo (**admin.js o alumno.js**), y ahi se definiran sus respectivas rutas. Ejemplo: 

 ```js
    route.get('/nombre-de-la-ruta', (req, res) => res.render('nombre-vista'));
 ```

Donde **/nombre-de-la-ruta** es el nombre de la ruta que desea declarar, ejemplo **/perfil**, de igual forma, puede agregar más paths, ejemplo **/perfil/direccion** o **/perfil/direccion/editar**, a libre elección siguiendo el patron de las vistas.

Ahora, **nombre-vista**, es el nombre del archivo donde esta la vista que se desea mostrar, las vistas se almacenan dentro de la carpeta **src/views/** con la extención **.hbs** en lugar de **.html**

Si el arhcivo esta dentro de una carpeta o más, entonces solo se coloca el nombre de la carpeta seguido del nombre del arhivo, ejemplo:

 ```js
    route.get('/login', (req, res) => res.render('auth/login'));
    route.get('/perfil', (req, res) => res.render('admin/alumnos/perfil'));
 ```

 Donde **/login** es mi ruta declarada y **auth/login** es la ruta donde se encuentra el archivo de la vista.

# Patron de diseño utilizado - MVC (Model - View - Controller)

# Creando nuevo Model
El modelo se crea en la carpeta **src/models**, el modelo principal es **Firebird.js**, el cual recibe 2 paramtros, que sera, muy importantes, el primero es el *nombre de la tabla* donde se definira el nombre de la tabla a cual se desee apuntar, luego es la *columna primaria* el cual se define la columna de la tabla el cual podria considerarse su **Primary Key**, hay tablas que ya tienen definida su propia clave primaria y ese se utlizaria. Como en el siguinete ejemplo:

```js
    const { Firebird } from './Firebird.js';
    const Alumno = new Firebird('alumnos', 'alumno_id');
    module.exports = Alumno;
```

En caso de que la tabla tenga multiples claves primarias, y no tenga uno deinido como tal, es hablar con el encargado del sistema y utilizar la columna que tendra un registro que NUNCA  se repitira, en ese caso, es podria ser su columna de llave primaria. Como en el siguinete ejemplo:

```js
    const { Firebird } from './Firebird.js';
    const Ciclos = new Firebird('ciclos', 'codigo');
    module.exports = Ciclos;
```

## Importante
Luego el archivo se tendra que registrar en el arhcivo **index.js** dentro la misma carpeta.

Para saber más sobre la funcionalidad del modelo Firebird, revisar el **FirebirdDoc.md** dentro la carpeta **models**

# Creando nuevo Controller

# Creando nueva View

# Creando nueva Api para las vitas