var database = require("../database/config")

function listarAlertasMaquinasPorQuadrante(fk_company, quadrante, periodo, tempo){
    var instrucaoSql = `
SELECT 
    AlertMachine.*, 
    Component.name AS componentName,
    Server.hostname,
    Server.position
FROM AlertMachine 
JOIN Measure ON AlertMachine.fkMeasure = Measure.idMeasure 
JOIN Component ON Measure.fkComponent = Component.idComponent 
JOIN Server ON Component.fkServer = Server.idServer 
WHERE Server.fkCompany = ${fk_company}
AND position = ${quadrante}
AND AlertMachine.dateTime >= DATE_SUB(NOW(), INTERVAL ${tempo} ${periodo});`

console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function listarAlertasPorComponentePorMaquina(fk_company, id_server,periodo, tempo){
    var instrucaoSql = `SELECT 
    Component.name AS componentName,
    Component.type AS componentType,
    DATE(AlertMachine.dateTime) as dia,
    COUNT(*) as totalAlertas
    FROM AlertMachine 
    JOIN Measure ON AlertMachine.fkMeasure = Measure.idMeasure 
    JOIN Component ON Measure.fkComponent = Component.idComponent 
    JOIN Server ON Component.fkServer = Server.idServer 
    WHERE Server.fkCompany = ${fk_company}
    AND idServer = ${id_server}
    AND AlertMachine.dateTime >= DATE_SUB(NOW(), INTERVAL ${tempo} ${periodo})
    GROUP BY Component.name, Component.type, DATE(AlertMachine.dateTime)
    ORDER BY dia ASC, componentName ASC;`

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function listarTodosAlertas(fk_company, periodo, tempo) {
    var instrucaoSql = `
    SELECT 
        AlertMachine.*, 
        Component.name AS componentName,
        Server.hostname,
        Server.position
    FROM AlertMachine 
    JOIN Measure ON AlertMachine.fkMeasure = Measure.idMeasure 
    JOIN Component ON Measure.fkComponent = Component.idComponent 
    JOIN Server ON Component.fkServer = Server.idServer 
    WHERE Server.fkCompany = ${fk_company}
    AND AlertMachine.dateTime >= DATE_SUB(NOW(), INTERVAL ${tempo} ${periodo})
    ORDER BY AlertMachine.dateTime DESC;`;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function listarMaquinas(fk_company) {
    var instrucaoSql = `
    SELECT idServer, hostname
    FROM Server
    WHERE fkCompany = ${fk_company}
    ORDER BY hostname;`;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function listarAlertasPorMaquinaUltimos30Dias(fk_company, quadrante) {
    var instrucaoSql = `
    SELECT 
        DATE(AlertMachine.dateTime) as dia,
        Server.idServer,
        Server.hostname,
        COUNT(*) as totalAlertas
    FROM AlertMachine 
    JOIN Measure ON AlertMachine.fkMeasure = Measure.idMeasure 
    JOIN Component ON Measure.fkComponent = Component.idComponent 
    JOIN Server ON Component.fkServer = Server.idServer 
    WHERE Server.fkCompany = ${fk_company}
    AND Server.position = ${quadrante}
    AND AlertMachine.dateTime >= DATE_SUB(NOW(), INTERVAL 30 DAY)
    GROUP BY DATE(AlertMachine.dateTime), Server.idServer
    ORDER BY dia ASC, Server.hostname ASC;`;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = {
    listarAlertasPorComponentePorMaquina,
    listarAlertasMaquinasPorQuadrante,
    listarTodosAlertas,
    listarMaquinas,
    listarAlertasPorMaquinaUltimos30Dias
};
