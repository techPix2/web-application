var empresaModel = require("../models/rootEmpresaModel");

function search(req, res) {
  const id = req.params.id;
  const mensagem = req.params.mensagem;

  empresaModel.search(id, mensagem)
  .then((resultado) => {
    res.json({
      lista: resultado
    })
  });
}

function filtrar(req, res) {
  const id = req.params.id;
  const selecionado = req.params.selecionado;

  empresaModel.filtrar(id, selecionado)
  .then((resultado) => {
    res.json({
      lista: resultado
    })
  });
}

function pesquisarFiltro(req, res) {
  const id = req.params.id;
  const tipo = req.params.tipo;
  const filtro = req.params.filtro;

  empresaModel.procurarFiltro(id, tipo, filtro)
  .then((resultado) => {
    res.json({
      lista: resultado
    })
  });
}

function procurarCards(req, res) {
  const id = req.params.id;

  empresaModel.procurarCards(id)
  .then((resultado) => {
    res.json({
      lista: resultado
    })
  });
}

function atualizarEmployer(req, res) {
  const { idEmployerServer, nomeServer, emailServer, cargoServer, senhaServer } = req.body;

  if (!idEmployerServer || !nomeServer || !emailServer || !cargoServer) {
      return res.status(400).json({
          success: false,
          message: "Todos os campos obrigatórios devem ser preenchidos"
      });
  }

  empresaModel.atualizarEmployer(idEmployerServer, nomeServer, emailServer, cargoServer, senhaServer)
  .then(function (resposta) {
      res.status(200).json({
          success: true,
          message: "Funcionário atualizado com sucesso",
          data: resposta
      });
  })
  .catch(function (erro) {
      console.error(erro);
      res.status(500).json({
          success: false,
          message: "Erro ao atualizar funcionário",
          error: erro.message
      });
  });
}

function cadastrarEmployer(req, res) {
  if (!req.body.nomeServer || !req.body.emailServer || !req.body.cargoServer || !req.body.senhaServer || !req.body.fkEmpresaServer) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios" });
  }

  empresaModel.cadastrarEmployer(
    req.body.nomeServer,
    req.body.emailServer,
    req.body.cargoServer,
    req.body.senhaServer,
    req.body.fkEmpresaServer
  )
  .then(function (resposta) {
    res.status(201).json({
      success: true,
      message: "Funcionário cadastrado com sucesso",
      data: resposta
    });
  })
  .catch(function (erro) {
    console.error(erro);
    res.status(500).json({
      success: false,
      message: "Erro ao cadastrar funcionário",
      error: erro.message
    });
  });
}

function removerEmployer(req, res) {
  if (!req.body.idEmployerServer) {
    return res.status(400).json({ error: "ID do funcionário é obrigatório" });
  }

  empresaModel.removerEmployer(req.body.idEmployerServer)
  .then(function (resultado) {
    res.status(200).json({
      success: true,
      message: "Funcionário removido com sucesso",
      data: resultado
    });
  })
  .catch(function (erro) {
    console.error(erro);
    res.status(500).json({
      success: false,
      message: "Erro ao remover funcionário",
      error: erro.message
    });
  });
}

module.exports = {
  search,
  filtrar,
  pesquisarFiltro,
  procurarCards,
  atualizarEmployer,
  cadastrarEmployer,
  removerEmployer
};
