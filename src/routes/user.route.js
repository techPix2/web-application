const express = require('express');
const router = express.Router();
const {login, listarUsuarios} = require("../controllers/user.controller")

router.post('/login', login);

router.get("/listar/:idEmpresa", listarUsuarios);

module.exports = router;