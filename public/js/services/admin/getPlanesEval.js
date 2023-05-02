const idplan = document.getElementById("idPlan")
const table = document.getElementById("table-content");

async function getPlanesEval(){
    let url=`/api/planes/${idplan.value}/eval`
    const res = await fetch(url)
    const data = await res.json()

    let content = ""
    data.data.forEach((item, index) => {
    content += `<tr>`;
    content += `<td>${index + 1} </td>`;
    content += `<td>${item.CLAVEASIGNATURA}</td>`;
    content += `<td>${item.ID_EVAL}</td>`;
    content += `<td>${item.NOMBRECORTO}</td>`;
    content += `<td>${item.DESCRIPCION}</td>`;
    content +="</tr>"
    })

    table.innerHTML=content
}



getPlanesEval()