var database = require("../database/config")

function listarAlertasMaquinasPorQuadrante(fk_company, quadrante, periodo, tempo){
    var instrucaoSql = `
SELECT * 
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
    var instrucaoSql = `SELECT * 
    FROM AlertMachine 
    JOIN Measure ON AlertMachine.fkMeasure = Measure.idMeasure 
    JOIN Component ON Measure.fkComponent = Component.idComponent 
    JOIN Server ON Component.fkServer = Server.idServer 
    WHERE Server.fkCompany = ${fk_company}
    AND idServer = ${id_server}
    AND AlertMachine.dateTime >= DATE_SUB(NOW(), INTERVAL ${tempo} ${periodo});`

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}
module.exports = {
    listarAlertasPorComponentePorMaquina,
    listarAlertasMaquinasPorQuadrante
};