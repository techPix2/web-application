var express = require("express");
var router = express.Router();
var dashAnalistaController = require("../controllers/dashAnalistaController");

router.get("/listarServidores/:fk_company", function (req, res) {
    dashAnalistaController.listarServidores(req, res);
});


module.exports = router;