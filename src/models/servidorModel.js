var database = require("../database/config")

function listarServidorPorEmpresa(fk_company){
    var instrucaoSql = `SELECT hostName, macAddress, status, position, mobuId, operationalSystem, fkCompany from Server WHERE fkCompany = ${fk_company}`
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = {
    listarServidorPorEmpresa
};