const express = require('express');
const router = express.Router();
const {
    postRealtimeData,
    getRealtimeDataByMachine
} = require('../controllers/realtime.controller');

router.post('/', postRealtimeData);
router.get('/:machineId', getRealtimeDataByMachine);

module.exports = router;
