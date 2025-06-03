const express = require('express');
const router = express.Router();
const { getMachineList, loginMachine, registerMachine, getMachineId } = require('../controllers/machine.controller');

router.get('/list', getMachineList);

router.post('/login', loginMachine);

router.post('/register', registerMachine);

router.post('/getMachineId', getMachineId);

module.exports = router;
