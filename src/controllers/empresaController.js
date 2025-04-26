const empresaModel = require("../models/empresaModel")

function autenticar(req, res) {
    var codigo_empresa = req.body.codigoServer;
    var email = req.body.emailServer;
    var senha = req.body.senhaServer;
        empresaModel.autenticar(codigo_empresa, email, senha)
            .then(
                function (resultadoAutenticar) {
                    res.json({
                        id: resultadoAutenticar[0].idEmpresa,
                        email: resultadoAutenticar[0].email,
                        nome: resultadoAutenticar[0].razaoSocial
                    });
                }
            ).catch(
                function (erro) {
                    console.log("\nHouve um erro ao realizar o login! Erro: ", erro.sqlMessage);
                    res.status(500).json(erro.sqlMessage);
                }
            );
}


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

function cadastrarCidade(req, res) {
  empresaModel.cadastrarCidade(
      req.body.cidade
  )
      .then(function (resposta) {
        res.status(201).json({
          success: true,
          message: "Cidade cadastrada com sucesso",
          data: resposta,
        });
      })
      .catch(function (erro) {
        console.error(erro);
        res.status(500).json({
          success: false,
          message: "Erro ao cadastrar cidade",
          error: erro.message
        });
      });
}

function cadastrarEndereco(req, res) {
    empresaModel.cadastrarEndereco(
        req.body.rua,
        req.body.numero,
        req.body.cep,
        req.body.bairro,
        req.body.fk_cidade
    ).then(function (resposta) {
          res.status(201).json({
            success: true,
            message: "Cidade cadastrada com sucesso",
            data: resposta,
          });
        })
        .catch(function (erro) {
          console.error(erro);
          res.status(500).json({
            success: false,
            message: "Erro ao cadastrar cidade",
            error: erro.message
          });
        });
  }

    function cadastrarEmpresa(req, res) {
    empresaModel.cadastrarEmpresa(
        req.body.razaosocial,
        req.body.cnpj,
        req.body.fk_endereco
    )
        .then(function (resposta) {
            res.status(201).json({
                success: true,
                message: "Empresa cadastrado com sucesso",
                data: resposta
            });
        })
        .catch(function (erro) {
            console.error(erro);
            res.status(500).json({
                success: false,
                message: "Erro ao cadastrar empresa",
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
    autenticar,
    cadastrarCidade,
    search,
    filtrar,
    atualizarEmployer,
    pesquisarFiltro,
    cadastrarEmployer,
    procurarCards,
    removerEmployer,
    cadastrarEndereco,
    cadastrarEmpresa
}