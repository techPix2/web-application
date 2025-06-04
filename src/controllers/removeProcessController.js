var removerModel = require("../models/removeProcessModel");

function removerProcessos(req, res) {
    const dados = req.body;

    if (!dados.nomePeocesso || !dados.dataHoraProcesso || !dados.percentualCpuProcesso || !dados.fkMaquina) {
        console.log("Dados incompletos:", dados);
        return res.status(400).json({ error: "Dados incompletos" });
    }

    removerModel.removerprocessos(dados)
        .then(result => {
            console.log("Processo removido com sucesso:", result);
            return res.status(200).json(result);
        })
        .catch(error => {
            console.error("Erro ao remover processo:", error);
            return res.status(500).json(error);
        });
}

module.exports = {
    removerProcessos
};