function toggleInternoForm() {
    var internoForm = document.getElementById("internoForm");
    var externoForm = document.getElementById("externoForm");
    var checkInterno = document.getElementById("checkInterno");
    var checkExterno = document.getElementById("checkExterno");
  
    if (checkInterno.checked) {
      internoForm.style.display = "block";
      externoForm.style.display = "none";
      checkExterno.checked = false;
    } else {
      internoForm.style.display = "none";
    }
  }
  
  function toggleExternoForm() {
    var internoForm = document.getElementById("internoForm");
    var externoForm = document.getElementById("externoForm");
    var checkInterno = document.getElementById("checkInterno");
    var checkExterno = document.getElementById("checkExterno");
  
    if (checkExterno.checked) {
      externoForm.style.display = "block";
      internoForm.style.display = "none";
      checkInterno.checked = false;
    } else {
      externoForm.style.display = "none";
    }
  }
  