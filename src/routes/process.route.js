const express = require('express');
const router = express.Router();

const {enfileirarComando, buscarComandos, excluirComandos, registerProcess, getProcessList} = require("../controllers/process.controller")

router.post('/excluir',enfileirarComando);

router.get('/comandos/:machineId',buscarComandos);

router.delete('/comandos/:machineId',excluirComandos);

router.post('/cadastrar', registerProcess);

router.post('/listar', getProcessList)


module.exports = router;