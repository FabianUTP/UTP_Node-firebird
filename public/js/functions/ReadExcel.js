const input = document.getElementById("input");

input.addEventListener("change", () => {
  readXlsxFile(input.files[0]).then((data = []) => {
    let regExp = new RegExp(/[0-9]?([a-z]){1,8}/);

    let excelFiltrado = data
      .filter((e) => !regExp.test(e)) // Filtra los datos que se necesitan
      .filter((e) => e.some(Boolean)) // Elimina las columnas que tengan todo null
      .map((e) => e.filter((i) => i !== null)); // Elimina las columnas vacias

    let formatJson = excelFiltrado.map((value) => {
      return {
        nombre: value[0],
        matricula: value[1],
        calificacion: value[2],
        asistencia: value[3],
        m: value[4],
      };
    });

    console.log(formatJson);
  });
});
