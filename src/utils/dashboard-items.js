const admin_items = [
  {
    path_img: "./imgs/alumnos.png",
    title: "Alumnos",
    content: "Ver y editar información de los alumnos.",
    link: "/alumnos",
  },
  {
    path_img: "./imgs/grupos.png",
    title: "Grupos",
    content: "Ver los grupos existentes y a sus alumnos.",
    link: "/Grupos",
  },
  {
    path_img: "./imgs/satisfaccion.png",
    title: "Otros   ",
    content: "Prueba",
    link: "#",
  },
];

const alumno_items = [
  {
    path_img: "./imgs/datos-del-usuario.png",
    title: "Datos personales",
    content:
      "Ingresa y actualiza tu dirección y teléfono; la persona autorizada para recibir información, datos de becas y seguro médico",
    link: "/perfil",
  },
  {
    path_img: "./imgs/documentos.png",
    title: "Documentos del alumno",
    content: "Ingresa y sube los documentos en formato.pdf",
    link: "/doctos",
  },
  {
    path_img: "./imgs/satisfaccion.png",
    title: "Boletas",
    content: "Ingresa, consulta y descarga tu boleta de calificaciones.",
    link: "/boletas",
  },
];
const profe_items = [
  {
    path_img: "./imgs/datos-del-usuario.png",
    title: "Datos personales",
    content:
      "Ingresa y actualiza tus datos personales; de jornada, datos exclusivos de la institución",
    link: "/datos",
  },
  {
    path_img: "./imgs/satisfaccion.png",
    title: "Calificaciones",
    content: "Ver o subir calificaciones de grupos.",
    link: "/profesores",
  },
];

module.exports = {
  admin_items,
  alumno_items,
  profe_items,
};
