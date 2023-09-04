const selectEmpresa = document.querySelector('.form-select');
const btnAgregarEmpresa = document.getElementById('btnAgregarEmpresa');

selectEmpresa.addEventListener('change', function () {
  if (this.value === 'opcion1') {
    btnAgregarEmpresa.style.display = 'block';
  } else {
    btnAgregarEmpresa.style.display = 'none';
  }
});
