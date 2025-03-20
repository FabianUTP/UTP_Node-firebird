const express = require("express");
const { engine } = require("express-handlebars");
const session = require("express-session");
const flash = require("connect-flash");
const path = require("path");
const fileUpload = require("express-fileupload");
require("dotenv").config();

const app = express();

// 🔥 Definir el modo de ejecución (local o server) desde los argumentos de la línea de comandos
const MODE = process.argv[2] || process.env.MODE || "local";
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 8080;

// 🔗 Configuración de la base de datos Firebird
const FB_HOST = MODE === "server" ? process.env.FB_HOST_SERVER : process.env.FB_HOST_LOCAL;
const FB_DATABASE = MODE === "server" ? process.env.FB_DATABASE_SERVER : process.env.FB_DATABASE_LOCAL;

// 📂 Configuración de vistas
app.set("views", path.join(__dirname, "src", "views"));
app.engine(".hbs", engine({
  defaultLayout: "main",
  layoutsDir: path.join(app.get("views"), "layouts"),
  partialsDir: [
    path.join(app.get("views"), "layouts"),
    path.join(app.get("views"), "alumno", "estadia", "partials"),
  ],
  extname: ".hbs",
}));
app.set("view engine", ".hbs");

// 🗂️ Archivos estáticos
app.use(express.static(path.join(__dirname, "public")));

// 🔧 Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// 📤 Configuración de subida de archivos
app.use(fileUpload({
  limits: { fileSize: 5 * 1024 * 1024 },
  abortOnLimit: true,
  responseOnLimit: "El archivo es demasiado grande",
  useTempFiles: true,
  tempFileDir: path.join(__dirname, "temp"),  // Guardar archivos temporalmente
}));

// 🔐 Configuración de sesión segura
app.use(session({
  secret: process.env.SESSION_SECRET || "fallbackSecret",
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false },  // Cambia a `true` si usas HTTPS
}));

app.use(flash());

// 🌍 Variables Globales
app.use(require("./globals"));

// 🚏 Rutas
app.use("/api", require("./src/routes/apis"));
app.use(require("./src/routes/routes"));

// ⚠️ Manejo de errores global
app.use((err, req, res, next) => {
  console.error("❌ Error en el servidor:", err);
  res.status(500).json({ error: "Ocurrió un error en el servidor" });
});

// 🚀 Iniciar el servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`🔄 Modo: ${MODE}`);
  console.log(`📡 Conectando a Firebird en: ${FB_HOST}`);
  console.log(`📂 Base de datos: ${FB_DATABASE}`);
});