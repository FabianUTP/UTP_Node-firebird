const loader = document.getElementById("preloader");
const container = document.getElementById("container");

// Esta funcion se puede llamar desde cualquier archivo externo
// Hace que no se refresque la pagina en el input de busqueda.
const loading = () => {
  if(loader || container) {
    loader.style.display = "block";
    container.classList.add("d-none");

    setTimeout(() => {
      loader.style.display = "none";
      container.classList.remove("d-none");
    }, 400);
  }
};

loading();