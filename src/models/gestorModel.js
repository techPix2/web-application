var database = require("../database/config");

function listarServidores(fk_company){
    var instrucaoSql = `
        SELECT s.idServer, s.hostName, s.macAddress 
FROM  Server s
LEFT JOIN Component c ON s.idServer = c.fkServer
LEFT JOIN Measure m ON c.idComponent = m.fkComponent
LEFT JOIN AlertMachine a ON m.idMeasure = a.fkMeasure
WHERE s.fkCompany = ${fk_company}
AND s.active = 1;`;



    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = {
    listarServidores
};