const table = document.getElementById("table-content")

let page = 1;

async function getPlanes() {
  const response = await fetch(`/api/planes?page=${page}`);
  const api = await response.json();
  console.log(api)

let content = ""

api.data.forEach((item, index) => {

    content += `<tr onclick="window.location.href='/academico/planes/${item.CLAVEASIGNATURA}'">`
    content += `<td>${index + 1} </td>`
    content += `<td>${item.ID_ETAPA}</td>`
    content += `<td>${item.CLAVEASIGNATURA}</td>`
    content += `<td>${item.NOMBREASIGNATURA}</td>`
    content += `<td>${item.CLAVEASIGNATURA}</td>`
    content += `<td>${item.ID_TIPOEVAL}</td>`
    content += "</tr>"
})

  table.innerHTML = content
}
function onPrev(){
    if(page> 1){
        page-- 
        getPlanes()
    }
}

function onNext(){
    page++;
    getPlanes()
}

getPlanes();
