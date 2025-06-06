const express = require('express');
const router = express.Router();
const {listarServidores} = require('../controllers/company.controller')

router.get("/listar/:idEmpresa", listarServidores);

module.exports = router;