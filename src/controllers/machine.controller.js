const { dadosMaquinas } = require('./realtime.controller');
const { buscarUsuario, cadastrarMaquina, buscarMaquina, getCompanyName, listarComponentesPorServidor, atualizarComponente, inserirComponente} = require('../models/machine.model');

function getMachineList(req, res) {
    const machines = Array.from(dadosMaquinas.keys());
    res.json({ machines });
}

async function loginMachine(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Os campos email e password são obrigatórios.' });
    }

    try {
        const resultado = await buscarUsuario(email, password);

        if (resultado.success) {
            return res.status(200).json({
                message: 'Login realizado com sucesso!',
                companyId: resultado.companyId
            });
        } else {
            return res.status(401).json({ error: 'email ou senha inválidos.' });
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

async function buscarNomeEmpresa(req, res) {
    const { companyId } = req.body;

    if (!companyId) {
        return res.status(400).json({ error: "O campo companyId é obrigatório." });
    }

    try {
        const resultado = await getCompanyName(companyId);

        if (resultado.success) {
            return res.status(200).json({ name: resultado.name });
        } else {
            return res.status(200).json({ name: resultado.name, aviso: "Nome padrão retornado." });
        }
    } catch (erro) {
        console.error("Erro no controller ao buscar nome da empresa:", erro);
        return res.status(500).json({ error: "Erro interno ao buscar nome da empresa." });
    }
}

async function getComponents(req, res) {
    const { fkServer } = req.params;

    try {
        const resultado = await listarComponentesPorServidor(fkServer);
        res.status(200).json(resultado);
    } catch (erro) {
        res.status(500).json({
            error: "Erro ao listar componentes",
            detalhes: erro
        });
    }
}

async function updateComponents(req, res) {
    const { idComponent, fkServer, type, description } = req.body;

    try {
        await atualizarComponente({ idComponent, fkServer, type, description });
        res.status(200).json({ success: true, message: "Componente atualizado com sucesso" });
    } catch (erro) {
        res.status(500).json({
            error: "Erro ao atualizar componente",
            detalhes: erro
        });
    }
}

async function registerComponent(req, res) {
    const { name, type, description, fkServer } = req.body;

    try {
        await inserirComponente({ name, type, description, fkServer });
        res.status(201).json({ success: true, message: "Componente inserido com sucesso" });
    } catch (erro) {
        res.status(500).json({
            error: "Erro ao inserir componente",
            detalhes: erro
        });
    }
}

module.exports = {
    getMachineList,
    loginMachine,
    registerMachine,
    getMachineId,
    buscarNomeEmpresa,
    getComponents,
    updateComponents,
    registerComponent
};
