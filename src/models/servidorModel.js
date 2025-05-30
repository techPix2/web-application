var database = require("../database/config")

function listarServidorPorEmpresa(fk_company){
    var instrucaoSql = `SELECT hostName, macAddress, status, position, mobuId, operationalSystem, fkCompany from Server WHERE fkCompany = ${fk_company}`
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function listarServidoresComAlerta(fk_company){
    var instrucaoSql = `SELECT DISTINCT 
    s.idServer,
    s.hostName,
    s.operationalSystem,
    s.status,
    am.type AS alert_type,
    am.dateTime AS alert_time,
    CASE 
        WHEN am.type = 'CPU' THEN am.cpuPercent
        WHEN am.type = 'RAM' THEN am.ramPercent
    END AS usage_percent
FROM Server s
INNER JOIN Component c ON s.idServer = c.fkServer
INNER JOIN AlertMachine am ON c.idComponent = am.fkComponent
WHERE 
    am.type IN ('CPU', 'RAM')
    AND am.dateTime >= NOW() - INTERVAL 24 HOUR
    AND s.fkCompany = ${fk_company}
ORDER BY am.dateTime DESC;`

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql)
        .catch(erro => {
            console.error("Erro ao executar SQL:", erro);
            throw erro; 
        });
}

module.exports = {
    listarServidorPorEmpresa, listarServidoresComAlerta
};