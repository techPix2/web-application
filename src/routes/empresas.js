var express = require("express");
var router = express.Router();

var empresaController = require("../controllers/empresaController");

router.get("/:mensagem/:id/search", function (req, res) {
  empresaController.search(req, res);
})

router.get("/:selecionado/:id/filtro", function (req, res) {
  empresaController.filtrar(req, res);
})

router.get("/:id/:tipo/:filtro/pesquisarFiltro", function (req, res) {
  empresaController.pesquisarFiltro(req, res);
})

router.get("/:id/procurarCards", function (req, res) {
  empresaController.procurarCards(req, res);
})

router.put("/atualizarFuncionario", function (req, res) {
  empresaController.atualizarEmployer(req, res);
})

router.post("/cadastrarFuncionario", function (req, res) {
  empresaController.cadastrarEmployer(req, res);
})

router.post("/autenticar", function (req, res) {
  empresaController.autenticar(req, res);
});

router.delete(`/removerFuncionario`, function (req, res) {
  empresaController.removerEmployer(req, res);
})

router.post("/cadastrarEmpresa/:razaosocial/:cnpj/:fk_endereco", function (req, res) {
  empresaController.cadastrarEmpresa(req,res);
})

router.post("/cadastrarEndereco/:rua/:numero/:cep/:bairro/:fk_cidade", function (req, res) {
  empresaController.cadastrarEndereco(req,res)
})
router.post("/cadastrarCidade/:cidade", function (req, res) {
  empresaController.cadastrarCidade(req,res)
})
module.exports = router;