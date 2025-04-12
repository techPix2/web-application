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
            c.idCompany,
            c.socialReason AS nome,
            c.cnpj,
            ct.email,
            ct.phone AS telefone,
            p.path
        FROM Company c
        JOIN Contact ct ON c.fkContact = ct.idContact
        JOIN Photo p on c.fkPhoto = p.idPhoto
    `;
    return database.executar(query);
}

async function excluirEmpresa(idCompany) {
    try {
        await database.executar(`
            DELETE l FROM login l
            JOIN employer e ON l.fkEmployer = e.idEmployer
            WHERE e.fkCompany = ${idCompany}
        `);

        await database.executar(`
            DELETE a FROM acesslog a
            JOIN employer e ON a.fkEmployer = e.idEmployer
            WHERE e.fkCompany = ${idCompany}
        `);

        await database.executar(`
            DELETE FROM server
            WHERE fkCompany = ${idCompany}
        `);

        await database.executar(`
            DELETE FROM employer
            WHERE fkCompany = ${idCompany}
        `);

        const empresa = await database.executar(`
            SELECT fkContact, fkPhoto 
            FROM Company 
            WHERE idCompany = ${idCompany}
        `);

        if (empresa.length === 0) {
            throw new Error('Empresa não encontrada');
        }

        await database.executar(`
            DELETE FROM Company 
            WHERE idCompany = ${idCompany}
        `);

        await database.executar(`
            DELETE FROM Contact 
            WHERE idContact = ${empresa[0].fkContact}
        `);
        
        await database.executar(`
            DELETE FROM Photo 
            WHERE idPhoto = ${empresa[0].fkPhoto}
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