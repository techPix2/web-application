const express = require("express");
const router = express.Router();
const techpixController = require("../controllers/techpixController");

// CADASTRAR EMPRESA
router.post("/cadastrarEmpresa", techpixController.cadastrarEmpresa);

// LISTAR EMPRESAS (mostrarCards)
router.get("/mostrarCards", techpixController.mostrarCards);

// EXCLUIR EMPRESA (nova rota)
router.delete("/excluirEmpresa/:id", techpixController.excluirEmpresa);

module.exports = router;