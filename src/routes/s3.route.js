const express = require("express");
const router = express.Router();
const s3Controller = require('../controllers/s3.controller')

router.get("/listar-arquivos", s3Controller.listarArquivos)

module.exports = router
