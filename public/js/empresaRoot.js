const id = sessionStorage.ID_EMPRESA;
razao.innerHTML = sessionStorage.NOME_USUARIO;
const modal = document.getElementById("modal");

function sair() {
    sessionStorage.removeItem(EMAIL_USUARIO);
    sessionStorage.removeItem(ID_FUNCIONARIO);
    sessionStorage.removeItem(NOME_USUARIO);
}

function cadastrar() {
    modal.style.display = 'flex';
    modal.showModal();
    console.log(window.innerWidth);
    const isMobile = window.innerWidth <= 1000;
    modal.style.width = isMobile ? '70%' : '45%';
    modal.style.height = isMobile ? '75%' : '75%';

    modal.innerHTML = `
        <div class="superior-modal">
            <div class="esquerda-superior-modal">
                <div class="circulo_imagem-modal">
                    <img class="icon-modal" src="../assets/icon/cadastrar.svg" alt="">
                </div>
                <span class="titulo_pagina">Cadastrar</span>
            </div>
            <div class="direita-superior-modal">
                <img class="close" src="../assets/icon/close.svg" alt="" onclick="closeModal()">
            </div>
        </div>
        <div class="inferior-modal">
            <div class="esquerda-inferior-modal">
                <div class="formulario">
                    <span class="descricao-modal">Nome Completo:<span class="obrigatorio">*</span></span>
                    <input class="input-modal" type="text" id="ipt_nome" placeholder="Ex: João Silva">
                </div>
                <div class="formulario">
                    <span class="descricao-modal">Email:<span class="obrigatorio">*</span></span>
                    <input class="input-modal" type="text" id="ipt_email" placeholder="Ex: joao@empresa.com">
                </div>
                <div class="formulario">
                    <span class="descricao-modal">Senha:<span class="obrigatorio">*</span></span>
                    <input class="input-modal" type="text" id="ipt_senha" placeholder="Mínimo 8 caracteres">
                    <small class="dica-senha">A senha deve conter letras maiúsculas, minúsculas e números</small>
                </div>
                <div class="formulario">
                    <span class="descricao-modal">Cargo:<span class="obrigatorio">*</span></span>
                    <select class="input-modal" id="ipt_cargo">
                        <option value="" selected disabled>Selecione um cargo</option>
                        <option value="Analista de Infraestrutura">Analista de Infraestrutura</option>
                        <option value="Cientista de Dados">Cientista de Dados</option>
                    </select>
                </div>
            </div>
            <div class="regiao-botao">
                <button class="botao-modal" onclick="enviarCadastro()">Cadastrar</button>
            </div>
        </div>
    `;
}

async function enviarCadastro() {
    const nome = document.getElementById('ipt_nome').value.trim();
    const email = document.getElementById('ipt_email').value.trim();
    const senha = document.getElementById('ipt_senha').value;
    const cargo = document.getElementById('ipt_cargo').value;
    const idEmpresa = sessionStorage.getItem('ID_EMPRESA') || id; 

    if (!nome.includes(" ")) {
        return alert("Por favor, insira o nome completo do funcionário");
    }
    
    try {
        const response = await fetch("/empresas/cadastrarFuncionario", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                nomeServer: nome,
                emailServer: email,
                cargoServer: cargo,
                senhaServer: senha,
                fkEmpresaServer: idEmpresa
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Erro ao cadastrar funcionário");
        }

        alert("Funcionário cadastrado com sucesso!");
        closeModal();
        mostrarCards();
    } catch (error) {
        console.error("Erro:", error);
        alert(`Erro ao cadastrar: ${error.message}`);
    }
}

function ativarFiltro(atividade) {
    let ativacao = atividade;

    if(ativacao == 0) {
        div_preferencias.innerHTML = `
            <img class="icon_filtro" src="../assets/icon/filtroAtivo.svg" alt="" onclick="ativarFiltro(1)">
            <select class="select-filtro" id="slt_tipo" onchange="trocarSegundoFiltro()">
                <option value="#" selected disabled>Categoria</option>
                <option value="name" >Nome</option>
                <option value="email">Email</option>
                <option value="role">Cargo</option>
            </select>
            <select class="select-filtro" id="slt_categoria" oninput="mostrarCards(1, 1)">
                <option value="#" selected disabled>Tipo</option>
                <option value="ASC">A-Z</option>
                <option value="DESC">Z-A</option>
            </select>
        `;
    } else {
        div_preferencias.innerHTML = `
            <img class="icon_filtro" src="../assets/icon/filtroDesativado.svg" alt="" onclick="ativarFiltro(0)">
        `;
    }
}

function trocarSegundoFiltro() {
    let selecionado = slt_tipo.value;

    if(selecionado == "nome") {
        slt_categoria.innerHTML = `
            <option value="#" selected disabled>Tipo</option>
            <option value="ASC">A-Z</option>
            <option value="DESC">Z-A</option>
        `;
    } else {
        fetch(`/empresas/${selecionado}/${id}/filtro`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        }).then(function (resposta){
            slt_categoria.innerHTML = '<option value="#" selected disabled>Tipo</option>';

            resposta.json()
            .then(json => {
                let vetorEmail = [];
                let vetor = [];
                for(let i = 0; i < (json.lista).length; i++) {
                    let opcaoAtual = (json.lista[i]).role ;
                    let confirmacao = 0;
                    let mensagem = "";
                    let palavra = ""

                        if(opcaoAtual.includes("@")) {
                            for(let ind = 0; ind < opcaoAtual.length; ind++) {
                                if(opcaoAtual[ind] == "@") {
                                    confirmacao = 1;
                                    palavra = "@";
                                } else if(confirmacao == 1) {
                                    palavra += opcaoAtual[ind];
                                }
    
                                if(!vetorEmail.includes(palavra)) {
                                    vetorEmail.push(palavra);
                                    mensagem = palavra;
                                }
                            }
                        } else if(!vetor.includes(opcaoAtual)) {
                            vetor.push(opcaoAtual);
                            mensagem = opcaoAtual;
                        }
                    if(mensagem != "") {
                        slt_categoria.innerHTML += `<option value="${mensagem}">${mensagem}</option>`;
                    }
                }
            })
        })
    }
}

function carregarHorario() {
    let horario = document.getElementById('horario');
    let dataAtual = new Date();
    let minuto = dataAtual.getMinutes();
    let dia = dataAtual.getDate();
    let mes = dataAtual.getMonth();

    if(dia < 10) {
        dia = dia.toString();
        dia = '0' + dia;
    }

    if(mes < 10) {
        mes += 1;
        mes = mes.toString();
        mes = '0' + mes;
    }

    if(minuto < 10) {
        minuto = minuto.toString();
        minuto = '0' + minuto;
    }

    let mensagem = dataAtual.getHours() + ":" + minuto + " " + dia + "/" + mes + "/" + dataAtual.getFullYear();
    horario.innerHTML = mensagem;
}

function mostrarCards(search, filtro) {
    carregarHorario()

    div_inferior.innerHTML = "";   

    if(search == undefined) {
        fetch(`/empresas/${id}/procurarCards`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        }).then(function (resposta) {
            resposta.json()
            .then(json => {

                for(let i = 0; i < (json.lista).length; i++) {
                    let pessoaAtual = (json.lista[i])
                
                div_inferior.innerHTML += `
                    <div class="cardMaior">
                        <div class="cabecalho-card">
                            <div class="esquerda-cabecalho-card">
                                <img class="imagem-perfil-card" src="../assets/imgs/user.png" alt="">
                                <span class="titulo-card" id="spn_nome">${pessoaAtual.name}</span>
                            </div>
                            <div class="circulo_icone">
                                <img class="icone-edit" onclick="editar('${pessoaAtual.name}', '${pessoaAtual.email}', '${pessoaAtual.password}', '${pessoaAtual.role}', ${pessoaAtual.idEmployer})" src="../assets/icon/edit.svg" alt="">
                            </div>
                        </div>
                        <div class="cardMenor">
                            <span class="textoCard">Email:</span>
                            <span class="textoCard" id="spn_email">${pessoaAtual.email}</span>
                            <span class="textoCard">Senha:</span>
                            <span class="textoCard" id="spn_senha">${pessoaAtual.password}</span>
                            <span class="textoCard">Cargo:</span>
                            <span class="textoCard" id="spn_cargo">${pessoaAtual.role}</span>
                        </div>
                    </div>
                `;

                }
            })
        })
    } else if(filtro == undefined) {
        let mensagem = ipt_search.value;
        if(mensagem == "") {
            mensagem = 1;
        }
    
        fetch(`/empresas/${mensagem}/${id}/search`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        }).then(function (resposta) {
            
            resposta.json()
                .then(json => {
                    for(let i = 0; i < (json.lista).length; i++) {
                        let pessoaAtual = (json.lista[i])
                    
                    div_inferior.innerHTML += `
                        <div class="cardMaior">
                            <div class="cabecalho-card">
                                <div class="esquerda-cabecalho-card">
                                    <img class="imagem-perfil-card" src="../assets/imgs/user.png" alt="">
                                    <span class="titulo-card" id="spn_nome">${pessoaAtual.name}</span>
                                </div>
                                <div class="circulo_icone">
                                    <img class="icone-edit" onclick="editar('${pessoaAtual.name}', '${pessoaAtual.email}', '${pessoaAtual.password}', '${pessoaAtual.role}', ${pessoaAtual.idEmployer})" src="../assets/icon/edit.svg" alt="">
                                </div>
                            </div>
                            <div class="cardMenor">
                                <span class="textoCard">Email:</span>
                                <span class="textoCard" id="spn_email">${pessoaAtual.email}</span>
                                <span class="textoCard">Senha:</span>
                                <span class="textoCard" id="spn_senha">${pessoaAtual.password}</span>
                                <span class="textoCard">Cargo:</span>
                                <span class="textoCard" id="spn_cargo">${pessoaAtual.role}</span>
                            </div>
                        </div>
                    `;
                    }
            })
        })
    } else {
        let filtro = slt_categoria.value;
        let tipo = slt_tipo.value;
    
        fetch(`/empresas/${id}/${tipo}/${filtro}/pesquisarFiltro`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        }).then(function (resposta) {
    
            resposta.json()
            .then(json => {

                for(let i = 0; i < (json.lista).length; i++) {
                    let pessoaAtual = (json.lista[i])
                
                div_inferior.innerHTML += `
                    <div class="cardMaior">
                        <div class="cabecalho-card">
                            <div class="esquerda-cabecalho-card">
                                <img class="imagem-perfil-card" src="../assets/imgs/user.png" alt="">
                                <span class="titulo-card" id="spn_nome">${pessoaAtual.name}</span>
                            </div>
                            <div class="circulo_icone">
                                <img class="icone-edit" onclick="editar('${pessoaAtual.name}', '${pessoaAtual.email}', '${pessoaAtual.password}', '${pessoaAtual.role}', ${pessoaAtual.idEmployer})" src="../assets/icon/edit.svg" alt="">
                            </div>
                        </div>
                        <div class="cardMenor">
                            <span class="textoCard">Email:</span>
                            <span class="textoCard" id="spn_email">${pessoaAtual.email}</span>
                            <span class="textoCard">Senha:</span>
                            <span class="textoCard" id="spn_senha">${pessoaAtual.password}</span>
                            <span class="textoCard">Cargo:</span>
                            <span class="textoCard" id="spn_cargo">${pessoaAtual.role}</span>
                        </div>
                    </div>
                `;
                }
            })
        })
    }
}

function editar(nome, email, senha, cargo, id) {
    modal.style.display = 'flex';
    modal.showModal();
    const isMobile = window.innerWidth <= 1000;
    modal.style.width = isMobile ? '70%' : '45%';
    modal.style.height = isMobile ? '75%' : '70%';
    
    modal.innerHTML = `
        <div class="superior-modal">
            <div class="esquerda-superior-modal">
                <div class="circulo_imagem-modal">
                    <img class="icon-modal" src="../assets/icon/edit.svg" alt="Ícone de edição">
                </div>
                <span class="titulo_pagina">Editar</span>
                <div class="circulo_imagem-modal-v">
                    <img src="../assets/icon/remove.svg" alt="Remover" class="icon-delete" onclick="deleteModal(${id}, '${nome.replace(/'/g, "\\'")}')">
                </div>
            </div>
            <div class="direita-superior-modal">
                <img class="close" src="../assets/icon/close.svg" alt="Fechar" onclick="closeModal()">
            </div>
        </div>
        <div class="inferior-modal">
            <div class="esquerda-inferior-modal">
                <div class="formulario">
                    <span class="descricao-modal">Nome Completo:<span class="obrigatorio">*</span></span>
                    <input class="input-modal" type="text" id="ipt_nome_editar" value="${nome.replace(/"/g, '&quot;')}">
                </div>
                <div class="formulario">
                    <span class="descricao-modal">Email:<span class="obrigatorio">*</span></span>
                    <input class="input-modal" type="email" id="ipt_email_editar" value="${email.replace(/"/g, '&quot;')}">
                </div>
                <div class="formulario">
                    <span class="descricao-modal">Senha:<span class="obrigatorio">*</span></span>
                    <input class="input-modal" type="password" id="ipt_senha_editar">
                </div>
                <div class="formulario">
                    <span class="descricao-modal">Cargo:<span class="obrigatorio">*</span></span>
                    <select class="input-modal" id="ipt_cargo_editar">
                        <option value="Analista de Infraestrutura">Analista de Infraestrutura</option>
                        <option value="Cientista de Dados">Cientista de Dados</option>
                    </select>
                </div>
            </div>
            <div class="direita-inferior-modal">
                <div class="regiao-botao">
                    <button class="botao-modal" onclick="enviarEdicao(${id})">Salvar Alterações</button>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('ipt_cargo_editar').value = cargo;
}

async function enviarEdicao(id) {
    const nome = document.getElementById('ipt_nome_editar').value.trim();
    const email = document.getElementById('ipt_email_editar').value.trim();
    const senha = document.getElementById('ipt_senha_editar').value;
    const cargo = document.getElementById('ipt_cargo_editar').value;

    if (!nome.includes(" ")) {
        return alert("Por favor, insira o nome completo");
    }
   
    try {
        const response = await fetch("/empresas/atualizarFuncionario", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                idEmployerServer: id,
                nomeServer: nome,
                emailServer: email,
                cargoServer: cargo,
                senhaServer: senha || null 
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Erro ao atualizar funcionário");
        }

        closeModal();
        mostrarCards();
    } catch (error) {
        console.error("Erro:", error);
        alert(`Erro ao atualizar: ${error.message}`);
    }
}

function deleteModal(idFuncionario, nome) {
    modal.style.display = 'flex';
    modal.showModal();

    if(window.innerWidth <= 1000) {
        modal.style.width = 70 + "%";
        modal.style.height = 18 + "%";
        modal.style.paddingTop = 5 + "%"
    } else {
        modal.style.width = 35 + "%";
        modal.style.height = 40 + "%";
    }
    console.log(idFuncionario);

    modal.innerHTML = `
        <div class="superior-modal">
            <div class="esquerda-superior-modal">
                <div class="circulo_imagem-modal-excluir">
                    <img class="" src="../assets/icon/remover-vermelho.svg" alt="">
                </div>
                <span class="titulo_modal_excluir">Excluir</span>
            </div>
            <div class="direita-superior-modal">
                <img class="close" src="../assets/icon/close-vermelho.svg" alt="" onclick="closeModal()">
            </div>
        </div>
        <div class="inferior-modal-excluir">
            <span class="mensagem-excluir">Deseja mesmo excluir o funcionário ${nome}?</span>
            <div class="area-botao-excluir">
                <button class="botao-modal-excluir" onclick="enviarDelete(${idFuncionario})">Confirmar</button>
            </div>
        </div>
    `;
}

function deleteModal(idFuncionario, nome) {
    modal.style.display = 'flex';
    modal.showModal();
    modal.innerHTML = `
        <div class="superior-modal">
            <div class="esquerda-superior-modal">
                <div class="circulo_imagem-modal-excluir">
                    <img src="../assets/icon/remover-vermelho.svg" alt="Ícone de exclusão">
                </div>
                <span class="titulo_modal_excluir">Excluir</span>
            </div>
            <div class="direita-superior-modal">
                <img class="close" src="../assets/icon/close-vermelho.svg" alt="Fechar" onclick="closeModal()">
            </div>
        </div>
        <div class="inferior-modal-excluir">
            <span class="mensagem-excluir">Deseja mesmo excluir o funcionário ${nome}?</span>
            <div class="area-botao-excluir">
                <button class="botao-modal-excluir" onclick="enviarDelete(${idFuncionario})">Confirmar</button>
            </div>
        </div>
    `;
}

async function enviarDelete(idFuncionario) {

    try {
        const response = await fetch("/empresas/removerFuncionario", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                idEmployerServer: idFuncionario // Corrigido para match com o backend
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Erro ao remover funcionário");
        }

        mostrarCards();
        closeModal();
    } catch (error) {
        console.error("Erro:", error);
        alert(`Erro ao remover: ${error.message}`);
    }
}

function closeModal() {
    modal.style.display = 'none';
    modal.close();
}

function closeModal() {
    modal.style.display = 'none';
    modal.close();
}