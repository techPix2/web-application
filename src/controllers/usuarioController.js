var usuarioModel = require("../models/usuarioModel");

function autenticar(req, res) {
    var email = req.body.emailServer;
    var senha = req.body.senhaServer;
    
    usuarioModel.autenticar(email, senha)
        .then(
            function (resultadoAutenticar) {
                console.log(`\nResultados encontrados: ${resultadoAutenticar.length}`);
                console.log(`Resultados: ${JSON.stringify(resultadoAutenticar)}`);
                
                if (resultadoAutenticar.length > 0) {
                    res.json({
                        id_func: resultadoAutenticar[0].idEmployer,
                        nome_func: resultadoAutenticar[0].name,
                        id_empresa: resultadoAutenticar[0].idCompany,
                        nome_empresa: resultadoAutenticar[0].socialReason,
                        cargo_func: resultadoAutenticar[0].role,
                        email: email, 
                        nome: resultadoAutenticar[0].name
                    });
                } else {
                    res.status(401).json({ erro: "Credenciais inválidas" });
                }
            }
        ).catch(
            function (erro) {
                console.log(erro);
                console.log("\nHouve um erro ao realizar o login! Erro: ", erro.sqlMessage);
                res.status(500).json(erro.sqlMessage);
            }
        );
}

function cadastrar(req, res) {
    // Crie uma variável que vá recuperar os valores do arquivo cadastro.html
    var nome = req.body.nome;
    var email = req.body.email;
    var senha = req.body.senha;
    var cpf = req.body.cpf
    var fk_empresa = req.body.fk_empresa;

        // Passe os valores como parâmetro e vá para o arquivo usuarioModel.js
        usuarioModel.cadastrarEmployer(nome,cpf, email, senha, fk_empresa)
        .then(function (resposta) {
            res.status(201).json({
                success: true,
                message: "Usuario cadastrado com sucesso",
                data: resposta
            });
        }
            ).catch(
                function (erro) {
                    console.log(erro);
                    console.log(
                        "\nHouve um erro ao realizar o cadastro! Erro: ",
                        erro.sqlMessage
                    );
                    res.status(500).json(erro.sqlMessage);
                }
            );
    }

module.exports = {
    autenticar,
    cadastrar
}