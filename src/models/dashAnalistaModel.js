var database = require("../database/config")

function listarServidores(fk_company){
    var instrucaoSql = `
SELECT * FROM Server 
WHERE fkCompany = ${fk_company}; `

console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}


module.exports = {
    listarServidores
};
