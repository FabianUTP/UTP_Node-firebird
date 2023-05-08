const body = document.getElementById("content");

const numalumno = document.getElementById("numeroalumno");
const select = document.getElementById("filterDocto");
let gradoSelected = 0;

const getDoctos = async () => {
  const url = `/api/doctos?numalumno=${numalumno.value}&grado=${gradoSelected}`;

  body.innerHTML = `<div class="d-flex justify-content-center">
    <div class="spinner-border text-primary" role="status"></div>
  </div>`;

  try {
    const res = await fetch(url);
    const { doctos = [] } = await res.json();

    let content = "";

    if (doctos.length > 0) {
      doctos.map((item) => {
        content += `<div class="col-md-6 col-lg-4 col-6">
          <div class="card border-alert">
            <br>
            <center>
              <img src="/imgs/pdf.png" alt="" class="img-fluid">
            </center>
            <br>
            <h4 class="title">  
              <center><a href="${item.ID_DOCTO}"> ${item.ID_DOCTO} <br>
                  <font color="GREEN">
                    <B>Entregado</B>
                  </font>
              </center>
            </h4>
          </div>
        </div>`;
      });
    } else {
      content += `<div class='text-center'>
        <h3>No hay documentos a mostrar</h3>
      </div>`;
    }

    body.innerHTML = content;
  } catch (error) {
    console.error(error);
  }
};

select.addEventListener("change", (e) => {
  gradoSelected = e.target.value;
  getDoctos();
});
