const { dadosMaquinas } = require('./realtime.controller');
const { buscarUsuario, cadastrarMaquina, buscarMaquina } = require('../models/machine.model');

function getMachineList(req, res) {
    const machines = Array.from(dadosMaquinas.keys());
    res.json({ machines });
}

async function loginMachine(req, res) {
    const { name, password } = req.body;

    if (!name || !password) {
        return res.status(400).json({ error: 'Os campos name e password são obrigatórios.' });
    }

    try {
        const resultado = await buscarUsuario(name, password);

        if (resultado.success) {
            return res.status(200).json({
                message: 'Login realizado com sucesso!',
                companyId: resultado.companyId
            });
        } else {
            return res.status(401).json({ error: 'Usuário ou senha inválidos.' });
        }
    } catch (error) {
        console.error('Erro ao realizar login:', error);
        return res.status(500).json({ error: 'Erro interno do servidor.' });
    }
}

async function registerMachine(req, res) {
    const { hostname, macAddress, mobuId, fkCompany } = req.body;

    if (!hostname || !macAddress || !mobuId || !fkCompany) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios: hostname, macAddress, mobuId, fkCompany.' });
    }

    try {
        const resultado = await cadastrarMaquina(hostname, macAddress, mobuId, fkCompany);

        if (resultado.success) {
            return res.status(201).json({ message: 'Máquina cadastrada com sucesso!' });
        } else {
            return res.status(500).json({ error: 'Erro ao cadastrar máquina.', detalhes: resultado.error });
        }
    } catch (error) {
        console.error('Erro inesperado ao registrar máquina:', error);
        return res.status(500).json({ error: 'Erro interno do servidor.' });
    }
}

async function getMachineId(req, res) {
    const { mobuId, fkCompany } = req.body;

    if (!mobuId || !fkCompany) {
        return res.status(400).json({ error: 'mobuId e fkCompany são obrigatórios.' });
    }

    try {
        const resultado = await buscarMaquina(mobuId, fkCompany);

        if (resultado.success) {
            return res.status(200).json({ idServer: resultado.idServer });
        } else {
            return res.status(404).json({ error: resultado.error || 'Máquina não encontrada.' });
        }
    } catch (error) {
        console.error('Erro ao buscar máquina:', error);
        return res.status(500).json({ error: 'Erro interno do servidor.' });
    }
}

module.exports = {
    getMachineList,
    loginMachine,
    registerMachine,
    getMachineId
};
