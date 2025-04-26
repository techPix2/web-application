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
        WHERE e.email = '${email}' AND e.password = '${senha}' AND e.active = '1';
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function cadastrarEmployer(nome,cpf, email, cargo, senha, fk_empresa) {
    let instrucaoSql = `INSERT INTO Employer (name,cpf,  email, password, role, fkCompany, active) VALUES ("${nome}","${cpf}" ,"${email}", "${senha}", "Administrador", ${fk_empresa}, 1);`;
    return database.executar(instrucaoSql);
}

module.exports = {
    autenticar,
    cadastrarEmployer
};