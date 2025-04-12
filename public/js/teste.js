function listarServidorPorEmpresa(){
    var fk_company = 1
    fetch(`/servidores/listarServidorPorEmpresa/${fk_company}`,{
        method:"GET"
    }).then((res) => {
        res.json().then((json)=>{
            console.log(json)
        });
    })
    .catch((err) => {
        console.log(err)
    })
}

function listarAlertasMaquinasPorQuadrante(fk_company, id_server, periodo, tempo){
    fetch(`/dashCientista/listarAlertasMaquinasPorQuadrante/${fk_company}/${id_server}/${periodo}/${tempo}`,{
        method:"GET"
    }).then((res) => {
        res.json().then((json)=>{
            console.log(json)
        });
    })
    .catch((err) => {
        console.log(err)
    })
}


function listarAlertasPorComponentePorMaquina(fk_company, id_server, periodo, tempo){
    fetch(`/dashCientista/listarAlertasPorComponentePorMaquina/${fk_company}/${id_server}/${periodo}/${tempo}`,{
        method:"GET"
    }).then((res) => {
        res.json().then((json)=>{
            console.log(json)
        });
    })
    .catch((err) => {
        console.log(err)
    })
}