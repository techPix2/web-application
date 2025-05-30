var servidorModel = require("../models/servidorModel");

function listarServidorPorEmpresa(req,res){
    var fk_company = req.params.fkEmpresa;
    servidorModel.listarServidorPorEmpresa(fk_company)
    .then((resultado) =>{
        res.status(200).json(resultado)
    })
    .catch((erro) =>{
        console.error(
            "\nHouve um erro ao buscar os servidores por empresa! Erro: ",
            erro.sqlMessage
          );
          res.status(500).json(erro.sqlMessage);
    });
}


function listarServidoresComAlerta(req,res){
    var fk_company = req.params.fkEmpresa;
    servidorModel.listarServidoresComAlerta(fk_company)
    .then((resultado) =>{
        res.status(200).json(resultado)
    })
    .catch((erro) =>{
        console.error(
            "\nHouve um erro ao buscar os servidores por empresa com alerta! Erro: ",
            erro.sqlMessage
          );
          res.status(500).json(erro.sqlMessage);
    });
}

module.exports = {
    listarServidorPorEmpresa, listarServidoresComAlerta
}