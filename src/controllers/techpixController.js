const techpixModel = require("../models/techpixModel");
const path = require("path");

function cadastrarEmpresa(req, res) {
    const { razao, email, cnpj, telefone } = req.body;
    const arquivo = req.file;

    if (!razao || !cnpj) {
        return res.status(400).json({
            success: false,
            message: "Razão social e CNPJ são obrigatórios"
        });
    }

    let photoPath = null;
    if (arquivo) {
        photoPath = "/uploads/" + arquivo.filename;
    }

    techpixModel.cadastrarEmpresa({
        razaoServer: String(razao),
        emailServer: String(email),
        cnpjServer: String(cnpj),
        telefoneServer: String(telefone),
        photoServer: photoPath
    })
    .then(() => {
        res.json({
            success: true,
            message: "Cadastro realizado"
        });
    })
    .catch(error => {
        console.error("Erro ao cadastrar empresa:", error);
        res.status(500).json({
            success: false,
            message: "Erro no servidor"
        });
    });
}

function mostrarCards(req, res) {
    techpixModel.listarEmpresas()
        .then(empresas => {
            console.log(empresas.json);
            res.json(empresas);
        })
        .catch(error => {
            console.error("Erro ao listar empresas:", error);
            res.status(500).json([]);
        });
}

function cadastrarEmpresa(req, res) {
  const razaoSocial = req.body.razaoServer;
  const email = req.body.emailServer;
  const codigo = req.body.codigoServer;
  const senha = req.body.senhaServer;
  const cnpj = req.body.cnpjServer;
  techpixModel.cadastrarEmpresa(razaoSocial, email, codigo, senha, cnpj)
  .then(function (resposta) {
    res.json({
      lista: resposta
    })
  })
} 

async function excluirEmpresa(req, res) {
    const idEmpresa = req.params.id;

    if (!idEmpresa || isNaN(idEmpresa)) {
        return res.status(400).json({
            success: false,
            message: "ID inválido"
        });
    }

    try {
        const resultado = await techpixModel.excluirEmpresa(idEmpresa);

        res.json({
            success: true,
            message: "Empresa foi desativada com sucesso"
        });
    } catch (error) {
        console.error("Erro no controller:", error);

        let status = 500;
        let message = "Erro ao excluir empresa";


        if (error.message.includes('não encontrada')) {
            status = 404;
            message = error.message;
        } else if (error.code === 'ER_ROW_IS_REFERENCED_2') {
            status = 400;
            message = "Ainda existem registros vinculados que impedem a exclusão";
        }

        res.status(status).json({
            success: false,
            message: message
        });
    }
}

module.exports = {
    cadastrarEmpresa,
    mostrarCards,
    excluirEmpresa
};
