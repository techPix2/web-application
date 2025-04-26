const id = sessionStorage.ID_EMPRESA;
razao.innerHTML = sessionStorage.NOME_USUARIO;

function sair() {
    sessionStorage.removeItem(EMAIL_USUARIO);
    sessionStorage.removeItem(ID_FUNCIONARIO);
    sessionStorage.removeItem(NOME_USUARIO);
}

function cadastrar() {
    const modal = document.getElementById("modal");
    modal.style.display = 'flex';
    modal.showModal();
    console.log(window.innerWidth);

    if(window.innerWidth <= 1000) {
        modal.style.width = 100 + "%";
        modal.style.height = 100 + "%";
    } else {
        modal.style.width = 20 + "%";
        modal.style.height = 10 + "%";
    }
    modal.style.margin = "auto";
    modal.style.overflowY="hidden";
    modal.innerHTML = `
        <div class="super-modal">
        <div class="superior-modal">
            <button onclick="logar()">Baixar</button>
            <button onclick="logar()">Instuções</button>
        </div>
        <div class="sair-modal">
            <button onclick="closeModal()">Sair</button>
        </div>  
        </div>
    `;
}

function ativarFiltro(atividade) {
    let ativacao = atividade;
    if(ativacao == 0) {
        div_preferencias.innerHTML = `
            <img class="icon_filtro" src="../assets/icon/filtroAtivo.svg" alt="" onclick="ativarFiltro(1)">
            <select class="select-filtro" id="slt_tipo" onchange="trocarSegundoFiltro()">
                <option value="#" selected disabled>Categoria</option>
                <option value="nome" >Nome</option>
                <option value="email">Email</option>
                <option value="cargo">Cargo</option>
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
                    let opcaoAtual = (json.lista[i]).Cargo ;
                    let confirmacao = 0;
                    let mensagem = "";
                    let palavra = "";
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
async function carregarServidores() {
    let fk_company = 1
    return fetch(`/gestor/listarServidores/${fk_company}`, {
        method: "GET"
    })
    .then((res) => res.json())
    .then((json) => {
        console.log(json);
        return json;
    })
    .catch((err) => {
        console.log(err);
    });
}
async function inativarServidor(id_server) {
    console.log(id_server)
    try {
        const resposta = await fetch(`/gestor/inativarServidor/${id_server}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (resposta.ok) {
            listarServidores();
        }
    } catch (erro) {
        console.error('Erro na requisição:', erro);
    }

}
async function listarServidores(){
    let servidores = await carregarServidores();
    const tabela = document.getElementById("table_servidores");
    tabela.innerHTML = `<tr>
                        <th>Nome servidor</th>
                        <th>MacAddres</th>
                        <th>Excluir</th>
                    </tr>`;
    for (let index = 0; index < servidores.length; index++) {
        tabela.innerHTML += `<tr>
                        <td>${servidores[index].hostName}</td>
                        <td>${servidores[index].macAddress}</td>
                        <td><button onclick="inativarServidor(${servidores[index].idServer})">Excluir</button></td>
                    </tr>`
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

function editar(nome, email, senha, cargo, id) {
    modal.style.display = 'flex';
    modal.showModal();
    console.log(id);

    if(window.innerWidth <= 1000) {
        modal.style.width = 100 + "%";
        modal.style.height = 100 + "%";
    } else {
        modal.style.width = 100 + "%";
        modal.style.height = 100 + "%";
    }

    modal.innerHTML = `
        <div class="superior-modal">
            <div class="esquerda-superior-modal">
                <div class="circulo_imagem-modal">
                    <img class="icon-modal" src="../assets/icon/edit.svg" alt="">
                </div>
                <span class="titulo_pagina">Editar</span>
                <div class="circulo_imagem-modal-v">
                    <img src="../assets/icon/remove.svg" alt="" class="icon-delete" onclick="deleteModal(${id}, '${nome}')">
                </div>
            </div>
            <div class="direita-superior-modal">
                <img class="close" src="../assets/icon/close.svg" alt="" onclick="closeModal()">
            </div>
        </div>
        <div class="inferior-modal">
            <div class="esquerda-inferior-modal">
                <div class="formulario">
                    <span class="descricao-modal">Nome Completo:<span class="obrigatorio">*</span></span>
                    <input class="input-modal" type="text" id="ipt_nome" value="${nome}">
                </div>
                <div class="formulario">
                    <span class="descricao-modal">Email:<span class="obrigatorio">*</span></span>
                    <input class="input-modal" type="text" id="ipt_email" value="${email}">
                </div>
                <div class="formulario">
                    <span class="descricao-modal">Senha:<span class="obrigatorio">*</span></span>
                    <input class="input-modal" type="text" id="ipt_senha" value="${senha}">
                </div>
                <div class="formulario">
                    <span class="descricao-modal">Cargo:<span class="obrigatorio">*</span></span>
                    <select class="input-modal" id="ipt_cargo">
                        <option value="Analista de Infraestrutura">Analista de Infraestrutura</option>
                        <option value="Cientista de Dados">Cientista de Dados</option>
                    </select>
                </div>
            </div>
            <div class="direita-inferior-modal">
                <div class="borda-imagem">
                    <span class="descricao-modal">Foto de Perfil: <span class="obrigatorio">*</span></span>
                    <div class="regiao-foto">
                        <div class="fundo-imagem">
                            <img class="upload-imagem" src="../assets/imgs/user.png" alt="">
                        </div>
                    </div>
                </div>
                <div class="regiao-botao">
                    <button class="botao-modal" onclick="enviarEdicao(${id})">Editar</button>
                </div>
            </div>
        </div>
    `;
    ipt_cargo.value = cargo;
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


function closeModal() {
    modal.style.display = 'none';
    modal.close();
}