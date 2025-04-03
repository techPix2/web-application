const techpixModel = require("../models/techpixModel");

// CADASTRAR EMPRESA (versão simplificada)
function cadastrarEmpresa(req, res) {
  // Garanta que os dados estão chegando
  console.log("Dados recebidos:", req.body);

  const { 
      razaoServer, 
      emailServer, 
      cnpjServer, 
      telefoneServer 
  } = req.body;

  if (!razaoServer || !cnpjServer) {
      return res.status(400).json({
          success: false,
          message: "Razão social e CNPJ são obrigatórios"
      });
  }

  techpixModel.cadastrarEmpresa({
      razaoServer: String(razaoServer),
      emailServer: String(emailServer),
      cnpjServer: String(cnpjServer),
      telefoneServer: String(telefoneServer)
  })
  .then(() => {
      res.json({ 
          success: true,
          message: "Cadastro realizado"
      });
  })
  .catch(error => {
      console.error("Erro:", error);
      res.status(500).json({
          success: false,
          message: "Erro no servidor"
      });
  });
}

// LISTAR TODAS AS EMPRESAS (para os cards)
function mostrarCards(req, res) {
    techpixModel.listarEmpresas()
        .then(empresas => {
            res.json(empresas);
        })
        .catch(error => {
            console.error("Erro ao listar empresas:", error);
            res.status(500).json([]);
        });
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
            message: "Empresa e todos os registros vinculados foram excluídos com sucesso"
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