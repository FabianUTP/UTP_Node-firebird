$(document).ready(function() {
    var unsavedChanges = false;
  
    // Detectar cambios en los campos de entrada
    $('input, textarea').on('input', function() {
      unsavedChanges = true;
    });
  
    // Detectar clic en los botones de la pestaña
    $('.nav-link').click(function(e) {
      if (unsavedChanges) {
        var confirmLeave = confirm("¿Estás seguro de que deseas cambiar de pestaña sin guardar los cambios?");
        if (!confirmLeave) {
          e.preventDefault();
        } else {
          unsavedChanges = false;
        }
      }
    });
  });