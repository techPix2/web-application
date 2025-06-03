const db = require('../database/config');

async function buscarUsuario(name, password) {
    const instrucao = `
        SELECT idEmployer, fkCompany 
        FROM Employer 
        WHERE name = '${name}' AND password = '${password}'
    `;

    try {
        const resultado = await db.executar(instrucao);

        if (resultado.length > 0) {
            console.log("Login realizado com sucesso!");
            return { success: true, companyId: resultado[0].fkCompany };
        } else {
            console.log("Usuário ou senha incorretos!");
            return { success: false };
        }
    } catch (erro) {
        console.error("Erro ao buscar usuário:", erro);
        return { success: false, error: erro };
    }
}

async function cadastrarMaquina(hostname, macAddress, mobuId, fkCompany) {
    const instrucao = `
        INSERT INTO server (hostName, macAddress, mobuId, fkCompany, active)
        VALUES ('${hostname}', '${macAddress}', '${mobuId}', '${fkCompany}', '1');
    `;

    try {
        await db.executar(instrucao);
        console.log("Máquina cadastrada com sucesso!");
        return { success: true };
    } catch (erro) {
        console.error("Erro ao cadastrar máquina:", erro);
        return { success: false, error: erro };
    }
}

async function buscarMaquina(mobuId, fkCompany) {
    const instrucao = `
        SELECT idServer FROM Server
        WHERE mobuId = '${mobuId}' AND fkCompany = '${fkCompany}'`;`
    `;

    try {
        const resultado = await db.executar(instrucao, [mobuId, fkCompany]);

        if (resultado.length > 0) {
            const idServer = resultado[0].idServer;
            console.log("Máquina encontrada com sucesso!");
            return { success: true, idServer };
        } else {
            console.log("Máquina não encontrada.");
            return { success: false, error: 'Máquina não encontrada' };
        }
    } catch (error) {
        console.error("Erro ao buscar máquina:", error);
        return { success: false, error };
    }
}

module.exports = {
    buscarUsuario,
    cadastrarMaquina,
    buscarMaquina
};
