const {listarServidoresPorEmpresa} = require("../models/company.model");

function listarServidores(req, res) {
    const idEmpresa = req.params.idEmpresa;

    if (!idEmpresa) {
        return res.status(400).json({ mensagem: "ID da empresa não fornecido." });
    }

    listarServidoresPorEmpresa(idEmpresa)
        .then(servidores => {
            if (servidores.length > 0) {
                res.status(200).json(servidores);
            } else {
                res.status(204).send("Nenhum servidor encontrado para esta empresa.");
            }
        })
        .catch(erro => {
            console.error("Erro ao listar servidores:", erro);
            res.status(500).json({ erro: "Erro ao buscar servidores da empresa." });
        });
}

module.exports = {
    listarServidores,
}