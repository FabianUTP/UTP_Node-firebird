const input = document.getElementById("input");

input.addEventListener("change", () => {
  readXlsxFile(input.files[0]).then((data = []) => {
    // let regExp = new RegExp(/[0-9]?([a-z]){1,8}/);

    // let excelFiltrado = data
    //   .filter((e) => !regExp.test(e)) // Filtra los datos que se necesitan
    //   .filter((e) => e.some(Boolean)) // Elimina las columnas que tengan todo null
    //   .map((e) => e.filter((i) => i !== null)); // Elimina las columnas vacias

    let excelFiltrado = [];

    data.forEach((item, index) => {
      if (index > 7) {
        excelFiltrado.push(item);
      }
    });

    let formatJson = excelFiltrado.map((value) => {
      return {
        nombre: value[1],
        matricula: value[2],
        calificacion: value[3],
      };
    });

  });
});
