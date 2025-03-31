var techpixModel = require("../models/techpixModel");

function search(req, res) {
  const id = req.params.id;
  const mensagem = req.params.mensagem;

  techpixModel.search(id, mensagem)
  .then((resultado) => {
    res.json({
      lista: resultado
    })
  });
}

function filtrar(req, res) {
  const id = req.params.id;
  const selecionado = req.params.selecionado;

  techpixModel.filtrar(id, selecionado)
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

  techpixModel.procurarFiltro(id, tipo, filtro)
  .then((resultado) => {
    res.json({
      lista: resultado
    })
  });
}

function procurarCards(req, res) {
  const id = req.params.id;

  techpixModel.procurarCards(id)
  .then((resultado) => {
    res.json({
      lista: resultado
    })
  });
}

function atualizarFuncionario(req, res) {
  const id = req.body.idFuncionarioServer;
  const nome = req.body.nomeServer;
  const email = req.body.emailServer;
  const cargo = req.body.cargoServer;
  const equipe = req.body.equipeServer;

  techpixModel.atualizarFuncionario(id, nome, email, cargo, equipe)
  .then(function (resposta) {
    res.json({
      lista: resposta
    });
  })
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

function removerFuncionario(req, res) {
  const idFuncionario = req.body.idFuncionarioServer;
  console.log(idFuncionario + " Controller");

  techpixModel.removerFuncionario(idFuncionario)
  .then(function (resultado) {
    res.send({
      lista: resultado
    })
  })
}

module.exports = {
  search,
  filtrar,
  pesquisarFiltro,
  procurarCards,
  atualizarFuncionario,
  cadastrarEmpresa,
  removerFuncionario
};
