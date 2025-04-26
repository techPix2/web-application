var database = require("../database/config")

function autenticar(codigo_empresa, email, senha) {
    var instrucaoSql = `SELECT idEmpresa, razaoSocial, email, codigoEmpresa FROM Empresa WHERE codigoEmpresa = '${codigo_empresa}' AND email = '${email}' AND senha = '${senha}';`;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function cadastrarCidade(cidade){
    var instrucaoSql = `INSERT INTO City (city) VALUES ('${cidade}')`;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function cadastrarEndereco(rua,numero,cep,bairro,fk_cidade){
    var instrucaoSql = `INSERT INTO Address (street, number, postalCode, district, fkCity) 
    VALUES ('${rua}', '${numero}', '${cep}', '${bairro}', ${fk_cidade});`
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}
function cadastrarEmpresa(razaosocial, cnpj, fk_endereco){
    var instrucaoSql = `INSERT INTO Company (socialReason, cnpj, active, fkAddress) VALUES ('${razaosocial}', '${cnpj}', 1, ${fk_endereco});`
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}
module.exports = {
    autenticar,
    cadastrarCidade,
    cadastrarEndereco,
    cadastrarEmpresa
};
  