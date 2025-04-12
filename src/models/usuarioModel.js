var database = require("../database/config")

function autenticar(email, senha) {
    var instrucaoSql = `
        SELECT 
            e.idEmployer,
            e.name,
            e.role,
            e.fkCompany AS idCompany,
            c.socialReason
        FROM Employer AS e
        JOIN Company AS c ON e.fkCompany = c.idCompany
        WHERE e.email = '${email}' AND e.password = '${senha}';
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function cadastrar(nome, email, senha, fkEmpresa) {
    var instrucaoSql = `
        INSERT INTO usuario (nome, email, senha, fk_empresa) VALUES ('${nome}', '${email}', '${senha}', '${fkEmpresa}');
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = {
    autenticar,
    cadastrar
};