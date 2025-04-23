const express = require("express");
const router = express.Router();
const gestorController = require("../controllers/gestorController");

router.get("/listarServidores/:fk_company", function (req, res) {
    gestorController.listarServidores(req, res);
});
module.exports = router;