const database = require("../database/config");

function cadastrarEmpresa(dados) {
  const query = `
      INSERT INTO Contact (email, phone) VALUES (
          '${dados.emailServer}',
          '${dados.telefoneServer}'
      );

      INSERT INTO Photo (path) VALUES (
          '${dados.photoServer}'
      );

      INSERT INTO Company (socialReason, cnpj, fkContact, fkPhoto) VALUES (
          '${dados.razaoServer}',
          '${dados.cnpjServer}',
          LAST_INSERT_ID(),
          LAST_INSERT_ID()
      );
  `;
  return database.executar(query);
}

// LISTAR (APENAS DADOS ESSENCIAIS)
function listarEmpresas() {
    const query = `
        SELECT 
            idCompany,
            socialReason AS nome,
            cnpj
        FROM Company
        WHERE active = 1
    `;
    return database.executar(query);
}

async function excluirEmpresa(idCompany) {
    try {
        const empresa = await database.executar(`
            SELECT idCompany 
            FROM Company 
            WHERE idCompany = ${idCompany}
        `);

        if (empresa.length === 0) {
            throw new Error('Empresa não encontrada');
        }

        // Atualizar o campo active para 0 ao invés de deletar a empresa
        await database.executar(`
            UPDATE Company 
            SET active = 0 
            WHERE idCompany = ${idCompany}
        `);

        return { affectedRows: 1 };
    } catch (error) {
        console.error("Erro no model:", error);
        throw error;
    }
}


module.exports = {
    cadastrarEmpresa,
    listarEmpresas,
    excluirEmpresa
};
