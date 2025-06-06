const {buscarUsuario, listarUsuariosPorEmpresa} = require("../models/user.model")

async function login(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ mensagem: "Email e senha são obrigatórios!" });
    }

    try {
        const resultado = await buscarUsuario(email, password);

        if (resultado.success) {
            return res.status(200).json({
                idEmployer: resultado.idEmployer,
                name: resultado.name,
                role: resultado.role,
                email: resultado.email,
                fkCompany: resultado.fkCompany,
                companyName: resultado.companyName
            });
        } else {
            return res.status(401).json({ mensagem: "Email ou senha inválidos." });
        }
    } catch (erro) {
        return res.status(500).json({ mensagem: "Erro interno ao realizar login.", erro });
    }
}

function listarUsuarios(req, res) {
    const idEmpresa = req.params.idEmpresa;

    if (!idEmpresa) {
        return res.status(400).json({ mensagem: "ID da empresa não fornecido." });
    }

    listarUsuariosPorEmpresa(idEmpresa)
        .then(usuarios => {
            if (usuarios.length > 0) {
                res.status(200).json(usuarios);
            } else {
                res.status(204).send("Nenhum usuário encontrado para esta empresa.");
            }
        })
        .catch(erro => {
            console.error("Erro ao listar usuários:", erro);
            res.status(500).json({ erro: "Erro ao buscar usuários da empresa." });
        });
}

module.exports = {
    login,
    listarUsuarios
};