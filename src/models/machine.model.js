const db = require('../database/config');

async function buscarUsuario(email, password) {
    const instrucao = `
        SELECT idEmployer, fkCompany 
        FROM Employer 
        WHERE email = '${email}' AND password = '${password}'
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
        VALUES ('${hostname}', '${macAddress}', '${mobuId}', ${fkCompany}, 1);
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

async function getCompanyName(companyId) {
    const instrucao = `
        SELECT socialReason FROM Company WHERE idCompany = ${companyId};
    `;

    try {
        const resultado = await db.executar(instrucao);

        if (resultado.length > 0) {
            return { success: true, name: resultado[0].socialReason };
        } else {
            return { success: false, name: "TechPix" }; // valor padrão
        }
    } catch (erro) {
        console.error("Erro ao buscar nome da empresa:", erro);
        return { success: false, error: erro, name: "TechPix" };
    }
}

async function listarComponentesPorServidor(fkServer) {
    const instrucao = `
        SELECT idComponent, name, type, description
        FROM Component 
        WHERE fkServer = ${fkServer}
    `;
    return db.executar(instrucao);
}

async function atualizarComponente({ idComponent, fkServer, type, description }) {
    const instrucao = `
        UPDATE Component
        SET type = '${type}', description = '${description}'
        WHERE idComponent = ${idComponent} AND fkServer = ${fkServer}
    `;
    return db.executar(instrucao);
}

async function inserirComponente({ name, type, description, fkServer }) {
    const instrucao = `
        INSERT INTO Component (name, type, description, fkServer)
        VALUES ('${name}', '${type}', '${description}', ${fkServer})
    `;
    return db.executar(instrucao);
}

module.exports = {
    buscarUsuario,
    cadastrarMaquina,
    buscarMaquina,
    getCompanyName,
    listarComponentesPorServidor,
    atualizarComponente,
    inserirComponente
};
