const express = require("express");
const router = express.Router();
const s3Controller = require('../controllers/s3.controller')

router.get("/listar-arquivos", s3Controller.listarArquivos)

router.post('/files', s3Controller.getFilesContent);

module.exports = router
