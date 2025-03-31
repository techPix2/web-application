var express = require("express");
var router = express.Router();

var techpixController = require("../controllers/techpixController");

//Recebendo os dados do html e direcionando para a função cadastrar de usuarioController.js
router.get("/:mensagem/:id/search", function (req, res) {
  techpixController.search(req, res);
})

router.get("/:selecionado/:id/filtro", function (req, res) {
  techpixController.filtrar(req, res);
})

router.get("/:id/:tipo/:filtro/pesquisarFiltro", function (req, res) {
  techpixController.pesquisarFiltro(req, res);
})

router.get("/:id/procurarCards", function (req, res) {
  techpixController.procurarCards(req, res);
})

router.put("/atualizarFuncionario", function (req, res) {
  techpixController.atualizarFuncionario(req, res);
})

router.post("/cadastrarEmpresa", function (req, res) {
  techpixController.cadastrarEmpresa(req, res);
})

router.post("/autenticar", function (req, res) {
  empresasController.autenticar(req, res);
});

router.delete(`/removerFuncionario`, function (req, res) {
  techpixController.removerFuncionario(req, res);
})

module.exports = router;