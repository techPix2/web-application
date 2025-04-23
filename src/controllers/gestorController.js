var gestorModel = require("../models/gestorModel");

function listarServidores(req,res){
    var fk_company = req.params.fk_company;
    if (!fk_company) {
        return res.status(400).json({ 
            erro: "ID da empresa não fornecido",
            detalhes: "O parâmetro fk_company é obrigatório na URL"
        });
    }
    gestorModel.listarServidores(fk_company)
        .then((resultado) => { 
            console.log(`\nServidores encontrados: ${resultado.length}`);
            res.status(200).json(resultado);
        })
        .catch((erro) => {
            console.error("Erro no controller ao listar servidores:", erro);
            res.status(500).json({ 
                erro: "Erro interno no servidor",
                detalhes: erro.message
            });
        });
}
module.exports = {
    listarServidores
};