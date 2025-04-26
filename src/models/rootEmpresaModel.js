var database = require("../database/config");

function search(id, mensagem) {
  let instrucaoSql = "";

  if(mensagem == 1) {
    instrucaoSql = `SELECT * FROM Employer WHERE fkCompany = ${id} AND role <> "Administrador"`;
  } else {
    instrucaoSql = `SELECT * FROM Employer WHERE name LIKE '%${mensagem}%' AND fkCompany = ${id} AND role <> "Administrador";`;
  }

  return database.executar(instrucaoSql);
}

function filtrar(id, selecionado) {
  let instrucaoSql = `SELECT ${selecionado} AS 'role' FROM Employer WHERE fkCompany = ${id};`;

  return database.executar(instrucaoSql);
}

function procurarFiltro(id, tipo, filtro) {
  let instrucaoSql;
  
  if(filtro == "ASC" || filtro == "DESC") {
    instrucaoSql = `SELECT * FROM Employer WHERE fkCompany = ${id} AND role <> "Administrador" ORDER BY ${tipo} ${filtro}`;
  } else if(filtro.includes("@")) {
    instrucaoSql = `SELECT * FROM Employer WHERE ${tipo} LIKE "%${filtro}" AND fkCompany = ${id} AND role <> "Administrador"`;
  } else {
    instrucaoSql = `SELECT * FROM Employer WHERE ${tipo} = "${filtro}" AND fkCompany = ${id} AND role <> "Administrador"`;
  }

  console.log('SQL Executado:', instrucaoSql); 
  return database.executar(instrucaoSql);
}

function procurarCards(id) {
  let instrucaoSql = `SELECT * FROM Employer WHERE fkCompany = ${id} AND role <> "Administrador" AND active = '1'`;

  return database.executar(instrucaoSql);
}

function atualizarEmployer(id, nome, email, cargo, senha) {
  let instrucaoSql = `
      UPDATE Employer 
      SET name = "${nome}", 
          email = "${email}", 
          role = "${cargo}"
  `;
  
  if (senha) {
      instrucaoSql += `, password = "${senha}"`;
  }
  
  instrucaoSql += ` WHERE idEmployer = ${id};`;
  
  return database.executar(instrucaoSql);
}



function removerEmployer(idFunc) {
  let instrucaoSql = `UPDATE Employer SET active = '0' WHERE idEmployer = ${idFunc};`

  return database.executar(instrucaoSql);
}

module.exports = {
  search,
  filtrar,
  procurarFiltro,
  procurarCards,
  atualizarEmployer,
  cadastrarEmployer,
  removerEmployer
};
