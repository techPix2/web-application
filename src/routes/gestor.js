const express = require("express");
const router = express.Router();
const gestorController = require("../controllers/gestorController");

router.get("/listarServidores/:fk_company", function (req, res) {
    gestorController.listarServidores(req, res);
});

router.put("/inativarServidor/:id_server", function (req, res) {
    gestorController.inativarServidor(req, res);
});
module.exports = router;

