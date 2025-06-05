const comandosPendentes = {};

function adicionarComando(machineId, comando) {
    if (!comandosPendentes[machineId]) {
        comandosPendentes[machineId] = [];
    }
    comandosPendentes[machineId].push(comando);
}

function obterComandos(machineId) {
    return comandosPendentes[machineId] || [];
}

function limparComandos(machineId) {
    comandosPendentes[machineId] = [];
}

module.exports = {
    adicionarComando,
    obterComandos,
    limparComandos,
};
