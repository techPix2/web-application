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


function obterDadosServidor(req, res) {
    //simulando 10 coletas para CPU e RAM //   MUDAR
    const cpuData = Array.from({length: 10}, () => Math.floor(Math.random() * 100));
    const ramData = Array.from({length: 10}, () => Math.floor(Math.random() * 100));
    const categories = [
        "10min atrás", "9min", "8min", "7min", "6min", "5min", "4min", "3min", "2min", "1min"
    ];
    res.json({
        series: [
            { name: "CPU", data: cpuData },
            { name: "RAM", data: ramData }
        ],
        categories
    });
}


module.exports = {
    listarServidorPorEmpresa, listarServidoresComAlerta, obterDadosServidor
}