var express = require("express");
var router = express.Router();

var servidorController = require("../controllers/servidorController");

router.get("/listarServidorPorEmpresa/:fkEmpresa", function (req, res) {
    servidorController.listarServidorPorEmpresa(req, res);
});

module.exports = router;