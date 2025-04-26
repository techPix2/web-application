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

//Listando todos os alertas de uma empresa
router.get("/listarTodosAlertas/:fk_company/:periodo/:tempo", function (req, res) {
    dashCientistaController.listarTodosAlertas(req, res);
});

//Listando todas as máquinas de uma empresa
router.get("/listarMaquinas/:fk_company", function (req, res) {
    dashCientistaController.listarMaquinas(req, res);
});

//Listando alertas por máquina nos últimos 30 dias para um quadrante específico
router.get("/listarAlertasPorMaquinaUltimos30Dias/:fk_company/:quadrante", function (req, res) {
    dashCientistaController.listarAlertasPorMaquinaUltimos30Dias(req, res);
});

module.exports = router;
