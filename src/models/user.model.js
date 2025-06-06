const db = require('../database/config');

async function buscarUsuario(email, password) {
    const instrucao = `
        SELECT
            e.idEmployer,
            e.name,
            e.role,
            e.email,
            e.fkCompany,
            c.socialReason AS companyName
        FROM Employer e
                 JOIN Company c ON e.fkCompany = c.idCompany
        WHERE e.email = '${email}' AND e.password = '${password}'
    `;

    try {
        const resultado = await db.executar(instrucao);

        if (resultado.length > 0) {
            const user = resultado[0];
            return {
                success: true,
                idEmployer: user.idEmployer,
                name: user.name,
                role: user.role,
                email: user.email,
                fkCompany: user.fkCompany,
                companyName: user.companyName
            };
        } else {
            return { success: false };
        }
    } catch (erro) {
        console.error("Erro ao buscar usuário:", erro);
        return { success: false, error: erro };
    }
}

module.exports = {
    buscarUsuario
};
