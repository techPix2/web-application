const db = require('../database/config');

async function cadastrarProcesso(nameProcess, fkMachine, cpu_percent){
    const instrucao = `
            INSERT INTO processLog (nameProcess, cpu_percent, fkMachine)
            VALUES ('${nameProcess}', '${cpu_percent}', ${fkMachine});
    `;

    try{
        await db.executar(instrucao);
        console.log("Processo cadastrado com sucesso");
        return {success: true};
    }catch(erro){
        console.error("Erro ao cadastrar processo:", erro);
        return {success: false, error: erro};
    }
}

async function getProcessesByMobuIds(mobuIds) {
    if (!Array.isArray(mobuIds) || mobuIds.length === 0) {
        throw new Error("mobuIds deve ser um array não vazio");
    }

    // Escapar e montar a lista manualmente com aspas simples
    const mobuIdList = mobuIds.map(id => `'${id.replace(/'/g, "''")}'`).join(', ');

    const query = `
        SELECT
            pl.idProcess,
            pl.nameProcess,
            pl.dtTime,
            pl.cpu_percent,
            s.mobuId
        FROM
            ProcessLog pl
                JOIN
            Server s ON pl.fkMachine = s.idServer
        WHERE
            s.mobuId IN (${mobuIdList})
        ORDER BY
            pl.dtTime DESC
    `;

    try {
        const rows = await db.executar(query); // apenas 1 argumento: a string
        return rows;
    } catch (erro) {
        console.error("Erro ao buscar processos:", erro);
        throw erro;
    }
}



module.exports = {
    cadastrarProcesso,
    getProcessesByMobuIds
}