var express = require("express");
var router = express.Router();
var dashCientistaController = require("../controllers/dashCientistaController");

//Não listei nada por componente, pois podemos tratar tudo isso via JS sem fazer diversas requisições no banco

// Aqui conseguimos tirar os dados de alerta por maquina e por componente de maquina
//Apenas precisamos mudar a modelagem p saber qual componente emitiu alertas
router.get("/listarAlertasMaquinasPorQuadrante/:fk_company/:quadrante/:periodo/:tempo", function (req, res) {
    dashCientistaController.listarAlertasMaquinasPorQuadrante(req, res);
});


//Listando todos os alertas de uma mesma maquina
router.get("/listarAlertasPorComponentePorMaquina/:fk_company/:id_server/:periodo/:tempo", function (req, res) {
    dashCientistaController.listarAlertasPorComponentePorMaquina(req, res);
});

module.exports = router;