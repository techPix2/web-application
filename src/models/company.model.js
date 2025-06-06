const db = require('../database/config');

async function listarServidoresPorEmpresa(idEmpresa) {
    const instrucao = `
        SELECT 
            hostName, 
            mobuId, 
            macAddress
        FROM Server
        WHERE fkCompany = ${idEmpresa} AND active = 1;
    `;

    try {
        const resultado = await db.executar(instrucao);
        return resultado;
    } catch (erro) {
        console.error("Erro ao listar servidores:", erro);
        throw erro;
    }
}

module.exports = {
    listarServidoresPorEmpresa
};