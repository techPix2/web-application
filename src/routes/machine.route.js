const express = require('express');
const router = express.Router();
const { getMachineList, loginMachine, registerMachine, getMachineId, buscarNomeEmpresa, getComponents, updateComponents,
    registerComponent
} = require('../controllers/machine.controller');

router.get('/list', getMachineList);

router.post('/login', loginMachine);

router.post('/register', registerMachine);

router.post('/getMachineId', getMachineId);

router.post('/getCompanyName', buscarNomeEmpresa)

router.get('/getComponents/:fkServer', getComponents);

router.put('/updateComponent', updateComponents);

router.post('/registerComponent', registerComponent);

module.exports = router;
