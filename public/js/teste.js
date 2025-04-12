function listarServidorPorEmpresa(fk_company){
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
