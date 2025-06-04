// comandoController.js
const { adicionarComando, obterComandos, limparComandos} = require('../store/process.store');
const {cadastrarProcesso} = require('../models/process.model')

function enfileirarComando (req, res) {
    const { machineId, comando } = req.body;

    if (!machineId || !comando) {
        return res.status(400).json({ erro: 'machineId e comando são obrigatórios' });
    }

    adicionarComando(machineId, comando);
    res.status(200).json({ mensagem: 'Comando enfileirado com sucesso' });
};

function buscarComandos  (req, res) {
    const { machineId } = req.params;

    if (!machineId) {
        return res.status(400).json({ erro: 'machineId é obrigatório' });
    }

    const comandos = obterComandos(machineId);
    res.status(200).json({ comandos });
};

function excluirComandos  (req, res) {
    const { machineId } = req.params;

    if (!machineId) {
        return res.status(400).json({ erro: 'machineId é obrigatório' });
    }

    limparComandos(machineId);
    res.status(200).json({ mensagem: 'Comandos limpos com sucesso' });
};

function registerProcess (req, res) {
    const {nameProcess, machineId, cpu_percent } = req.body;

    if(!machineId || !cpu_percent || nameProcess) {
        return res.status(400).json({error: "os campos machineId e cpu_percent são obrigatórios"});
    }

    try{
        const resultado = cadastrarProcesso(nameProcess, machineId, cpu_percent);

        if(resultado.success){
            return res.status(200).json({idProcess: resultado.idProcess});
        }else{
            return res.status(404).json({error: resultado.error || "Processo não cadastrado"});
        }
    }catch(err){
        console.error("erro ao cadastrar processo",err);
        return res.status(500).json({error: "Erro interno do servidor"})
    }

}

module.exports = {
    enfileirarComando,
    buscarComandos,
    excluirComandos,
    registerProcess
}