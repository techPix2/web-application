const express = require("express");
const router = express.Router();
const dashmatheusController = require("../controllers/dashmatheusController");

router.get("/dadosMaquina", function(req, res){ 
    dashmatheusController.dadosMaquina
});

module.exports = router;