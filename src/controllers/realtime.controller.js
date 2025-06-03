const dadosMaquinas = new Map();

function postRealtimeData(req, res) {
    const { machineId, timestamp, data } = req.body;

    if (!machineId || !timestamp || !data) {
        return res.status(400).json({ error: 'machineId, timestamp e data são obrigatórios' });
    }

    const entry = { timestamp, data };

    if (!dadosMaquinas.has(machineId)) {
        dadosMaquinas.set(machineId, []);
    }

    const lista = dadosMaquinas.get(machineId);
    lista.push(entry);

    // Limita a 20 registros por máquina
    if (lista.length > 20) lista.shift();

    res.status(200).json({ status: 'ok' });
}

function getRealtimeDataByMachine(req, res) {
    const { machineId } = req.params;

    if (!dadosMaquinas.has(machineId)) {
        return res.status(404).json({ error: 'Máquina não encontrada' });
    }

    res.json({
        machineId,
        entries: dadosMaquinas.get(machineId)
    });
}

module.exports = {
    postRealtimeData,
    getRealtimeDataByMachine,
    dadosMaquinas
};
