var express = require("express");
var router = express.Router();

var servidorController = require("../controllers/servidorController");

router.get("/listarServidorPorEmpresa/:fkEmpresa", function (req, res) {
    servidorController.listarServidorPorEmpresa(req, res);
});

router.get("/listarServidoresComAlerta/:fkEmpresa", function (req, res) {
    servidorController.listarServidoresComAlerta(req, res);
});

//grafico
router.get("/dados/:id", function (req, res) {
    servidorController.obterDadosServidor(req, res);
});


module.exports = router;