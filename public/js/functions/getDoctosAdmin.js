let nivelSelected = '';

const carreraSelected = (carrera) => {
    nivelSelected = carrera;
    getDoctos();
}

const getDoctos = async () => {
  const url = `http://localhost:2020/api/doctos/admin?nivel=${nivelSelected}`;
  const response = await fetch(url);
  const data = await response.json();

  //console.log(data);
};
