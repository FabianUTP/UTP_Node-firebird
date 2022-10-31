const idGrupo = document.getElementById("codigo_grupo");
const evaluacion = document.getElementById("evaluacion");
const asignatura = document.getElementById("asignatura");

evaluacion.addEventListener("change", (e) => {
    let eval = e.target.value;
    getAsignaturas(eval);
})

const getAsignaturas = async (eval) => {
    let url = `/api/asignaturas?idGrupo=${idGrupo.value}&eval=${eval}`;
    const res = await fetch(url);
    const { data } = await res.json()
    console.log(data);

    asignatura.innerHTML = '';
    let contentAsig = '';

    data.map(item => {
        contentAsig += `<option value="${item.CLAVEASIGNATURA}">`;
        contentAsig += `${item.NOMBREASIGNATURA}`
        contentAsig += '</option>';
    });

    asignatura.innerHTML = contentAsig;
}