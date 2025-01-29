## **Pasos para la Configuración Inicial del Proyecto**

1. **Instalación de Dependencias**:
   - Ejecuta `npm install` una sola vez para instalar las dependencias del proyecto especificadas en el archivo `package.json`.

   - Si usas `nodemon` para reinicios automáticos al cambiar los archivos:
     ```bash
     nodemon app.js
     ```

3. **Versiones y Herramientas Requeridas**:
   - **Node.js** versión 15 o superior.
   - Editor de código recomendado: **Visual Studio Code**.

---

## **Estructura del Proyecto**

### **1. Rutas (`routes/`)**
- Rutas principales para **Administrador** y **Alumno**:
  - **admin.js**: Define rutas relacionadas con la administración.
  - **alumno.js**: Define rutas específicas para alumnos.

#### **Creación de Nuevas Rutas**:
```js
route.get('/ruta-ejemplo', (req, res) => res.render('vista-ejemplo'));
```

- **Estructura**:
  - `/ruta-ejemplo` es el endpoint.
  - `vista-ejemplo` es el archivo de la vista (almacenado en `src/views/` con extensión `.hbs`).

---

### **2. Modelos (`src/models/`)**
- Los modelos utilizan la clase principal `Firebird` para interactuar con la base de datos.

#### **Ejemplo de Modelo**:
```js
const { Firebird } = require('./Firebird.js');
const Alumno = new Firebird('alumnos', 'alumno_id');
module.exports = Alumno;
```

- **Parámetros Importantes**:
  - Primer parámetro: Nombre de la tabla.
  - Segundo parámetro: Columna de clave primaria (`Primary Key`).

#### **Registro en el Archivo Principal (`index.js`)**:
- Cada nuevo modelo debe importarse y registrarse en `models/index.js`.

---

### **3. Controladores (`src/controllers/`)**
- Los controladores manejan la lógica de negocio y coordinan entre el modelo y la vista.

#### **Crear un Nuevo Controlador**:
- Define funciones específicas que interactúen con los modelos y envíen datos a las vistas.

Ejemplo:
```js
const Alumno = require('../models/Alumno');

const obtenerAlumnos = async (req, res) => {
  const alumnos = await Alumno.all();
  res.render('admin/alumnos', { alumnos });
};

module.exports = { obtenerAlumnos };
```

---

### **4. Vistas (`src/views/`)**
- Las vistas utilizan **Handlebars** (`.hbs`) como motor de plantillas.
- Las vistas deben respetar una estructura clara y reutilizar componentes mediante parciales (`partials/`).

#### **Ejemplo de Vista**:
Archivo: `src/views/admin/alumnos.hbs`
```html
<h1>Lista de Alumnos</h1>
<ul>
  {{#each alumnos}}
    <li>{{this.nombre}} - {{this.matricula}}</li>
  {{/each}}
</ul>
```

---

### **5. API para Vistas**
- Crear APIs para alimentar las vistas dinámicamente con datos del servidor.

#### **Ejemplo de API**:
Archivo: `routes/admin.js`
```js
router.get('/api/alumnos', async (req, res) => {
  const alumnos = await Alumno.all();
  res.json({ alumnos });
});
```

- Desde el cliente, puedes consumir esta API usando `fetch` o cualquier librería como `axios`.

#### **Ejemplo de Consumo en Frontend**:
```js
fetch('/api/alumnos')
  .then((response) => response.json())
  .then((data) => {
    console.log(data.alumnos);
  })
  .catch((error) => console.error('Error:', error));
```

---

## **Enlaces Útiles**
- [Express.js - Rutas y Middlewares](http://expressjs.com/es/guide/routing.html)
- [Handlebars.js - Plantillas](https://handlebarsjs.com/guide/)
- [Node-Firebird - Conexión a Base de Datos Firebird](https://www.npmjs.com/package/node-firebird)
- [Bootstrap Icons](https://icons.getbootstrap.com)

---

## **Recomendaciones Finales**
1. **Mantén la consistencia en la estructura del proyecto**:
   - Modelos en `src/models/`.
   - Controladores en `src/controllers/`.
   - Vistas en `src/views/`.

2. **Uso del Patrón MVC**:
   - Divide claramente las responsabilidades entre Modelos, Vistas y Controladores para facilitar la mantenibilidad del proyecto.

3. **Documentación del Código**:
   - Documenta todas las rutas, APIs y funcionalidades críticas para que otros desarrolladores puedan entenderlas fácilmente.

### **Instalación de `nodemon` y su Función**

#### **¿Qué es `nodemon`?**
`nodemon` es una herramienta que ayuda a los desarrolladores de Node.js a reiniciar automáticamente la aplicación del servidor cuando detecta cambios en los archivos del proyecto. Esto elimina la necesidad de detener y reiniciar manualmente el servidor cada vez que realizas modificaciones en el código.

---

### **Instalación de `nodemon`**

1. **Instalar `nodemon` de manera global (recomendado):**
   - Esto permite usar el comando `nodemon` en cualquier proyecto.
   ```bash
   npm install -g nodemon
   ```

2. **Instalar `nodemon` como dependencia de desarrollo en tu proyecto:**
   - Si prefieres usarlo solo dentro del proyecto.
   ```bash
   npm install --save-dev nodemon
   ```

---

### **Uso Básico de `nodemon`**

1. **Ejecutar tu aplicación con `nodemon`:**
   - Reemplaza el comando habitual de `node` con `nodemon` para iniciar tu aplicación.
   ```bash
   nodemon app.js
   ```

2. **Configurar un script en `package.json`:**
   - Agrega un script para facilitar el uso:
   ```json
   "scripts": {
     "dev": "nodemon app.js"
   }
   ```
   - Luego ejecuta:
   ```bash
   npm run dev
   ```

---

### **Beneficios de `nodemon`**

- **Ahorro de tiempo:** Detecta automáticamente cambios en los archivos y reinicia el servidor.
- **Configuración sencilla:** No requiere cambios complejos en el proyecto.
- **Compatibilidad:** Funciona con cualquier aplicación Node.js.
- **Soporte para configuraciones personalizadas:** Permite especificar extensiones de archivos, ignorar carpetas específicas, entre otros.

---

### **Configuración Opcional de `nodemon`**

Puedes personalizar el comportamiento de `nodemon` creando un archivo de configuración llamado `nodemon.json` en la raíz del proyecto.

Ejemplo de archivo `nodemon.json`:
```json
{
  "watch": ["src", "config"], // Directorios a observar
  "ext": "js,json,hbs",       // Extensiones de archivos a observar
  "ignore": ["node_modules"], // Directorios a ignorar
  "exec": "node app.js"       // Comando para ejecutar la aplicación
}
```

---

### **Ejemplo Práctico**

Supongamos que tienes un archivo `app.js` como este:
```js
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('¡Hola, Mundo!');
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor escuchando en el puerto ${PORT}`));
```

1. Inicia el servidor con:
   ```bash
   nodemon app.js
   ```

2. Modifica el archivo `app.js`, por ejemplo, cambia el mensaje a:
   ```js
   res.send('¡Hola, Mundo! Actualizado con nodemon');
   ```

3. Observa cómo `nodemon` reinicia automáticamente el servidor al detectar el cambio.

---

se realizo cambios a la api calificaciones...
mostrando los datos que tiene los ciclos por el nombre de los alumnos 













Para instalar y configurar Docker en **Windows**, sigue estos pasos:

### Paso 1: Instalar Docker en Windows

1. **Descargar Docker Desktop**:
   - Dirígete a la [página oficial de Docker Desktop para Windows](https://www.docker.com/products/docker-desktop).
   - Haz clic en **Get Docker** para descargar el instalador.

2. **Instalar Docker Desktop**:
   - Ejecuta el archivo descargado para iniciar el proceso de instalación.
   - Sigue las instrucciones en pantalla. Durante la instalación, asegúrate de que Docker se integrará con **Windows Subsystem for Linux 2 (WSL 2)**. Docker Desktop requiere WSL 2 para funcionar en Windows 10 y versiones posteriores.

3. **Reiniciar el sistema**:
   - Una vez completada la instalación, es posible que debas reiniciar tu computadora para finalizar la configuración de Docker.

4. **Verificar la instalación**:
   - Después de reiniciar, abre la aplicación **Docker Desktop** desde el menú de inicio de Windows.
   - Docker debería iniciarse y aparecer en la bandeja del sistema. Si todo está correctamente instalado, deberías ver el icono de Docker en la bandeja de tareas y un mensaje indicando que Docker está corriendo.

5. **Comprobar la versión de Docker**:
   - Abre la terminal de **PowerShell** o **Command Prompt** (cmd) y ejecuta:
     ```bash
     docker --version
     ```
   - Si Docker está correctamente instalado, deberías ver la versión de Docker que tienes instalada.

### Paso 2: Configurar tu Proyecto con Docker

#### 1. Crear el `Dockerfile`

Sigue los mismos pasos que te di en el mensaje anterior para crear el archivo `Dockerfile` en la raíz de tu proyecto.

# version de nuestro Node.js
FROM node:16-bullseye

# Establece el directorio de trabajo
WORKDIR /app

# Copia solo el archivo package.json y package-lock.json para aprovechar el cache de Docker
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el resto de los archivos
COPY . .

# Expón el puerto 3000 (o el que uses)
EXPOSE 2020

# Comando para iniciar la aplicación
CMD ["npm", "start"]


#### 2. Construir la Imagen Docker

1. Abre **PowerShell** o **Command Prompt** y navega a la raíz del proyecto donde creaste el `Dockerfile`.
2. Ejecuta el siguiente comando para construir la imagen Docker:

   ```bash
   docker build . -t node-api-utp:latest
   ```

   Este comando construye una imagen llamada `node-api-utp` con la etiqueta `latest`.

#### 3. Ejecutar el Contenedor

Para ejecutar el contenedor en Windows, usa el siguiente comando en la terminal (PowerShell o Command Prompt):

```bash
docker run --env-file=./.env -p 2020:2020 node-api-utp:latest
```

- `--env-file=./.env`: Este parámetro carga las variables de entorno desde un archivo `.env` si lo tienes en el proyecto.
- `-p 2020:2020`: Mapea el puerto 2020 del contenedor al puerto 2020 en tu máquina local.

### Paso 3: Verificar

Una vez que el contenedor esté ejecutándose, puedes verificar que tu API está funcionando correctamente abriendo un navegador y visitando `http://localhost:2020`.

### Paso 4: Detener el Contenedor

Para detener el contenedor en Windows, puedes usar:

```bash
docker stop <container_id>
```

Para encontrar el `container_id`, ejecuta:

```bash
docker ps
```

Esto te mostrará los contenedores en ejecución, y podrás copiar el ID del contenedor que deseas detener.

### Consideraciones Especiales para Windows

- **WSL 2 (Windows Subsystem for Linux 2)**: Docker en Windows requiere que tengas **WSL 2** habilitado para funcionar correctamente. Si no tienes WSL 2 instalado, el instalador de Docker Desktop te guiará en el proceso de configuración.
- **Recursos de Docker**: Docker Desktop usa recursos de tu computadora (CPU, RAM). Puedes configurar estos recursos desde la configuración de Docker Desktop (haciendo clic derecho en el icono de Docker en la bandeja del sistema y seleccionando **Settings**). Asegúrate de asignar suficientes recursos a Docker, especialmente si estás ejecutando contenedores grandes.

Con esto, ya tendrás Docker configurado y funcionando correctamente en tu entorno de Windows. ¡Ahora puedes comenzar a trabajar con tu API Node.js en un contenedor Docker!




una vez terminado el contenedor y la imagen de doker crear un post=2020 en la terminal de nuestro servidor---->


![image](https://github.com/user-attachments/assets/f15a802b-1c63-472c-9e2f-559bf62cd4a3)





