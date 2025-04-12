var dashAnalistaModel = require("../models/dashAnalistaModel");

function listarServidores(req,res){
    var fk_company = sessionStorage.fk_company
    

    dashAnalistaModel.listarServidores(fk_company)
    .then((resultado) =>{ 
        res.status(200).json(resultado)
        console.log(resultado)
    })
    .catch((erro) =>{
        console.error(
            "\nHouve um erro ao buscar os alertas por quadrante! Erro: ",
            erro.sqlMessage
          );
          res.status(500).json(erro.sqlMessage);
    });

}


module.exports = {
    listarServidores,
   
}