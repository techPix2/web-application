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

module.exports = {
    cadastrarProcesso,
}