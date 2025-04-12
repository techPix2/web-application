var dashCientistaModel = require("../models/dashCientistaModel");

function listarAlertasMaquinasPorQuadrante(req,res){
    var fk_company = req.params.fk_company;
    var quadrante = req.params.quadrante;
    var periodo = req.params.periodo;
    var tempo = req.params.tempo;
    dashCientistaModel.listarAlertasMaquinasPorQuadrante(fk_company, quadrante, periodo, tempo)
    .then((resultado) =>{
        res.status(200).json(resultado)
    })
    .catch((erro) =>{
        console.error(
            "\nHouve um erro ao buscar os alertas por quadrante! Erro: ",
            erro.sqlMessage
          );
          res.status(500).json(erro.sqlMessage);
    });
}
function listarAlertasPorComponentePorMaquina(req,res){
    var fk_company = req.params.fk_company;
    var id_server = req.params.id_server;
    var periodo = req.params.periodo;
    var tempo = req.params.tempo;
    dashCientistaModel.listarAlertasPorComponentePorMaquina(fk_company, id_server, periodo, tempo)
    .then((resultado) =>{
        res.status(200).json(resultado)
    })
    .catch((erro) =>{
        console.error(
            "\nHouve um erro ao buscar os alertas de componente por maquina Erro: ",
            erro.sqlMessage
          );
          res.status(500).json(erro.sqlMessage);
    });
}

module.exports = {
    listarAlertasMaquinasPorQuadrante,
    listarAlertasPorComponentePorMaquina
}