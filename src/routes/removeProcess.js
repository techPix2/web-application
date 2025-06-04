const express = require("express");
const router = express.Router();
const removeProcessController = require("../controllers/removeProcessController");


router.post("/removerProcessos", function (req, res) {
    removeProcessController.removerProcessos(req, res);
});

module.exports = router;