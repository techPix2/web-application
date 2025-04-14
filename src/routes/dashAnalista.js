const express = require("express");
const router = express.Router();
const dashAnalistaController = require("../controllers/dashAnalistaController");

router.get("/servidores/:fk_company", dashAnalistaController.listarServidores);

module.exports = router;