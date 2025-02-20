const btn_act = document.getElementById("btn-habilitar");
  const btn_update = document.getElementsByName("guardarForm");

  btn_act.addEventListener("click", () => {
    btn_update.forEach(item => item.classList.remove("d-none"));

    btn_act.style.display = "none";

    let inputs = document.getElementsByTagName("input");
    let selects = document.getElementsByTagName("select");
    let txtarea = document.getElementsByTagName("textarea");

    for (let i = 0; i < inputs.length; i++) {
      inputs[i].disabled = false;
    }

    for (let i = 0; i < selects.length; i++) {
      selects[i].disabled = false;
    }

    for (let i = 0; i < txtarea.length; i++) {
      txtarea[i].disabled = false;
    }

    // Manda al principio de la pagina
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  });