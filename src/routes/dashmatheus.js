const express = require("express");
const router = express.Router();


var dadosEnviados;

router.get("/dadosRecebidos", (req, res) => {
    console.log("aqui")
    res.status(200).send(dadosEnviados);
})

router.post("/dadosMaquina", function(req, res){
    var body = req.body;
    console.log("Dados recebidos:", body);
    dadosEnviados = body;

    res.status(200).send("sucesso")
});


module.exports = router;