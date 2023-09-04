$(document).ready(function() {
    $('.nav-link').on('click', function() {
      $('.nav-link').removeClass('fade-in').addClass('fade-out');
      $(this).removeClass('fade-out').addClass('fade-in');
    });
  });