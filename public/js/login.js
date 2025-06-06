function validarEmail() {
    var email = document.getElementById('iptemail').value;
    var mensagemErro = "";
    var tamanhoValido = false;

    if (!email) {
        mensagemErro = ` `;
    }
    if (!email.includes('@')) {
        mensagemErro += `O email deve incluir '@'<br>`;
    }
    if (!email.includes('.')) {
        mensagemErro += `O email deve incluir ponto '.'<br>`;
    }
    if (email.includes(' ')) {
        mensagemErro += `O email não pode conter espaços<br>`;
    }
    if (email.length < 5) {
        mensagemErro += `O email deve ter no mínimo 5 caracteres<br>`;
    } else if (email.length > 100) {
        mensagemErro += `O email deve ter no máximo 100 caracteres<br>`;
    } else {
        tamanhoValido = true;
    }

    divmsg.innerHTML = mensagemErro;

    return email.includes('@') && email.includes('.') && !email.includes(' ') && tamanhoValido;
}

function validarSenha() {
    var senha = document.getElementById('iptsenha').value;
    var mensagemErro = "";
    var caracteres = ['!', '@', '#', '$', '%', '&', '*', '_', '?', '/'];
    var especiais = false;
    var numero = false;
    var minuscula = false;
    var maiuscula = false;
    var espaco = false;

    if (!senha) {
        mensagemErro = `Insira uma senha para continuar<br>`;
    }
    if (senha.length < 6) {
        mensagemErro += `Senha muito curta! A senha deve ter pelo menos 6 caracteres<br>`;
    } else if (senha.length > 30) {
        mensagemErro += `Senha muito longa! A senha deve ter no máximo 30 caracteres<br>`;
    }

    for (let i = 0; i < senha.length; i++) {
        const char = senha[i];
        if (caracteres.includes(char)) {
            especiais = true;
        }
        if (!isNaN(char)) {
            numero = true;
        }
        if (char.toUpperCase() !== char) {
            minuscula = true;
        }
        if (char.toLowerCase() !== char) {
            maiuscula = true;
        }
        if (char === ' ') {
            espaco = true;
        }
    }

    if (!especiais) {
        mensagemErro += `A senha deve incluir ao menos um caracter especial<br>`;
    }
    if (!numero) {
        mensagemErro += `A senha deve incluir ao menos um número<br>`;
    }
    if (!minuscula) {
        mensagemErro += `A senha deve incluir ao menos uma letra minúscula<br>`;
    }
    if (!maiuscula) {
        mensagemErro += `A senha deve incluir ao menos uma letra maiúscula<br>`;
    }
    if (espaco) {
        mensagemErro += `A senha não pode incluir espaços em branco<br>`;
    }

    divmsg.innerHTML = mensagemErro;

    return especiais && numero && minuscula && maiuscula && !espaco;
}

function logar() {
    const email = document.getElementById('iptemail').value;
    const senha = document.getElementById('iptsenha').value;
    const modalLogin = document.querySelector('.modalLogin');
    const modalErroLogin = document.querySelector('.modalErroLogin');
    const btnProsseguir = document.querySelector('.continuar');
    const btnTentar = document.querySelector('.tentar-novamente');

    if (validarEmail() && validarSenha()) {
        fetch("/user/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email,
                password: senha
            })
        }).then(function (resposta) {
            if (resposta.ok) {
                resposta.json().then(json => {
                    sessionStorage.NOME_EMPRESA = json.companyName;
                    sessionStorage.CARGO_FUNCIONARIO = json.role;
                    sessionStorage.ID_FUNCIONARIO = json.idEmployer;
                    sessionStorage.ID_EMPRESA = json.fkCompany;
                    sessionStorage.NOME_USUARIO = json.name;
                    sessionStorage.EMAIL_USUARIO = json.email;

                    modalLogin.style.display = 'block';

                    btnProsseguir.addEventListener("click", () => {
                        setTimeout(function () {
                            switch (sessionStorage.CARGO_FUNCIONARIO) {
                                case "Administrador":
                                    window.location.href = "../user/dashboardVinicius.html";
                                    break;
                                case "Analista":
                                    window.location.href = "../user/dashboardLara.html";
                                    break;
                                case "Cientista":
                                    window.location.href = "../user/dashboardFelipe.html";
                                    break;
                            }
                            modalLogin.style.display = 'none';
                        }, 2000);
                    });
                });
            } else {
                modalErroLogin.style.display = 'block';
                btnTentar.addEventListener("click", () => modalErroLogin.style.display = 'none');

                resposta.text().then(texto => {
                    console.error("Erro:", texto);
                });
            }
        }).catch(function (erro) {
            console.error("Erro na requisição:", erro);
        });

        return false;
    }
}
