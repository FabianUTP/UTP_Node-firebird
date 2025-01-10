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
    title: "Calificaciones",
    content: "Ver y Subir Calificaciones",
    link: "admin/calificacion",
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
    link: "/BoletasAlumnos",
  },
  {
    path_img: "./imgs/estadias.png",
    title: "Estadia",
    content: "Ingresa y sube los documentos en formato.pdf e verifica tu informacion, de tus estadias",
    link: "/estadia",
  },
  {
    path_img: "./imgs/titulacion.png",
    title: "Titulación",
    content: "Ingresa y sube los documentos en formato.pdf, de tus estadias",
    link: "/titulacion",
  },
  {
    path_img: "./imgs/Reincripción.png",
    title: "Reinscripción",
    content: "Ingresa y verifica tus datos y tramita tu reinscripción",
    link: "/reinscrip-cion",
  },
  {
    path_img: "./imgs/calendario.png",
    title: "Calendario Escolar",
    content: "Consulta nuestro Calendario Escolar y Actividades Académico-Administrativas, del ciclo 2022-2023.",
    link: "http://www.utponiente.edu.mx/utp/doctos/CALENDARIO%20ESCOLAR%20UTP%202022-2023_AUTORIZADO_FIRMAS.pdf",
  },
  {
    path_img: "./imgs/reglas.png",
    title: "Reglamento Escolar",
    content: "Consulta nuestro Reglamento de Ingreso, Permanencia y Egreso de Alumnos de la UTP (RAPEA-UTP) y conoce tus derechos y obligaciones.",
    link: "http://www.utponiente.edu.mx/utp/reglamento.php",
    target: "_blank",

  },
  {
    path_img: "./imgs/privacidad.png",
    title: "Aviso de Privacidad",
    content: "Consulta nuestro Aviso de Privacidad, y conoce cómo son tratados tus datos personales.",
    link: "https://controlescolarutp.wixsite.com/utp-yucatan/aviso-de-privacidad",
  },
  {
    path_img: "./imgs/constancias.png",
    title: "Solicitar Constancias",
    content: "Solicita algún documento que avale que estudias con nosotros.",
    link: "https://docs.google.com/forms/d/e/1FAIpQLSdNuf2y0l21Qbh1E6fBZaCXgG7t8GRHwYuvsnB7NA6DnMIfDQ/viewform",
  },
];

const aspirante_items = [
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
    link: "/grupoprofe",
  },
  {
    path_img: "./imgs/reglas.png",
    title: "Reglamento Escolar",
    content: "Consulta nuestro Reglamento de Ingreso, Permanencia y Egreso de Alumnos de la UTP (RAPEA-UTP) y conoce tus derechos y obligaciones.",
    link: "http://www.utponiente.edu.mx/utp/reglamento.php",
    target: "_blank",

  },
  {
    path_img: "./imgs/privacidad.png",
    title: "Aviso de Privacidad",
    content: "Consulta nuestro Aviso de Privacidad, y conoce cómo son tratados tus datos personales.",
    link: "https://controlescolarutp.wixsite.com/utp-yucatan/aviso-de-privacidad",
  },
  {
    path_img: "./imgs/calendario.png",
    title: "Calendario Escolar",
    content: "Consulta nuestro Calendario Escolar y Actividades Académico-Administrativas, del ciclo 2023-2024.",
    link: "https://utponiente.edu.mx/utp/doctos/CALENDARIO%20ESCOLAR%20UTP%202023-2024_FIRMADO.pdf",
  },
];

module.exports = {
  admin_items,
  alumno_items,
  profe_items,
  aspirante_items,
};
