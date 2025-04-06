const express = require("express");
const router = express.Router();
const techpixController = require("../controllers/techpixController");
const upload = require('../models/uploadConfig');
// CADASTRAR EMPRESA
router.post("/cadastrarEmpresa", upload.single('logo'), techpixController.cadastrarEmpresa);

// LISTAR EMPRESAS (mostrarCards)
router.get("/mostrarCards", techpixController.mostrarCards);

// EXCLUIR EMPRESA (nova rota)
router.delete("/excluirEmpresa/:id", techpixController.excluirEmpresa);

module.exports = router;