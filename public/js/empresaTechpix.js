const id = sessionStorage.ID_EMPRESA;
razao.innerHTML = sessionStorage.NOME_USUARIO;
const modal = document.getElementById("modal");

function sair() {
   sessionStorage.clear();
   window.location.href = "../login.html";
}

function cadastrar() {
    modal.style.display = 'flex';
    modal.showModal();

    if(window.innerWidth <= 1000) {
        modal.style.width = "70%";
        modal.style.height = "75%";
    } else {
        modal.style.width = "45%";
        modal.style.height = "75%";
    }

    modal.innerHTML = `
        <div class="superior-modal">
            <div class="esquerda-superior-modal">
                <div class="circulo_imagem-modal">
                    <img class="icon-modal" src="../assets/icon/cadastrar.svg" alt="">
                </div>
                <span class="titulo_pagina">Cadastrar empresa</span>
            </div>
            <div class="direita-superior-modal">
                <img class="close" src="../assets/icon/close.svg" onclick="closeModal()">
            </div>
        </div>
        <div class="inferior-modal">
            <div class="formulario">
                <span class="descricao-modal">Logo da Empresa:</span>
                <input type="file" id="uploadLogo" accept="image/*" onchange="previewLogo()">
                <img id="logoPreview" style="max-width: 100px; display: none;">
            </div>
            <div class="formulario">
                <span class="descricao-modal">Razão Social:<span class="obrigatorio">*</span></span>
                <input class="input-modal" type="text" id="ipt_razao">
            </div>
            <div class="formulario">
                <span class="descricao-modal">Email:<span class="obrigatorio">*</span></span>
                <input class="input-modal" type="text" id="ipt_email">
            </div>
            <div class="formulario">
                <span class="descricao-modal">CNPJ:<span class="obrigatorio">*</span></span>
                <input class="input-modal" type="text" id="ipt_cnpj">
            </div>
            <div class="formulario">
                <span class="descricao-modal">Telefone:<span class="obrigatorio">*</span></span>
                <input class="input-modal" type="text" id="ipt_telefone">
            </div>
            <button class="botao-modal" onclick="enviarCadastro()">Cadastrar</button>
        </div>
    `;
}

function enviarCadastro() {
    const dados = {
        razaoServer: document.getElementById('ipt_razao').value,
        emailServer: document.getElementById('ipt_email').value,
        cnpjServer: document.getElementById('ipt_cnpj').value,
        telefoneServer: document.getElementById('ipt_telefone').value
    };

    
    if (!dados.razaoServer || !dados.cnpjServer) {
        alert("Preencha todos os campos obrigatórios!");
        return;
    }

    fetch("/techpix/cadastrarEmpresa", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dados) 
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert("Empresa cadastrada!");
            closeModal();
            mostrarCards();
        } else {
            alert("Erro: " + data.message);
        }
    })
    .catch(error => console.error("Erro:", error));
}

function closeModal() {
    modal.style.display = 'none';
    modal.close();
}

function carregarHorario() {
    const data = new Date();
    horario.innerHTML = data.toLocaleTimeString() + " " + data.toLocaleDateString();
}

carregarHorario();
setInterval(carregarHorario, 60000);

async function mostrarCards() {
    try {
        const response = await fetch("/techpix/mostrarCards");
        
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }

        const empresas = await response.json();
        const divInferior = document.getElementById("div_inferior");

        divInferior.innerHTML = "";

        empresas.forEach(empresa => {
            const cardHTML = `
                <div class="cardMaior" style="margin: 10px; padding: 15px; border: 1px solid #ddd; border-radius: 5px;">
                <button class="btn-excluir" onclick="excluirEmpresa(${empresa.idCompany})" 
                style="background-color: red; border-radius: 10px; font-size: 16px; cursor: pointer; padding: 3%">
                 Excluir empresa
                </button>
                <div class="cabecalho-card">
                    <span class="titulo-card" style="font-weight: bold;">${empresa.nome}</span>
                    </div>
                    <div class="cardMenor" style="margin-top: 10px; text-align: center;">
                        <img class="logo" src="${empresa.logo ? empresa.logo : './uploads/imagem-padrão.png'}" 
                            alt="Logo de ${empresa.nome}" style="max-width: 100px; height: auto; display: block; margin: 0 auto;">
                        <div><strong>CNPJ:</strong> ${empresa.cnpj}</div>
                        <div><strong>Email:</strong> ${empresa.email}</div>
                        <div><strong>Telefone:</strong> ${empresa.telefone}</div>
                    </div>
                </div>
            `;
            divInferior.innerHTML += cardHTML;
        });

    } catch (error) {
        console.error("Falha ao carregar empresas:", error);
        alert("Erro ao carregar dados das empresas");
    }
}

window.onload = function() {
    mostrarCards(); 
    carregarHorario(); 
};

async function excluirEmpresa(id) {
    console.log('ID recebido para exclusão:', id);
    if (confirm('Tem certeza que deseja excluir esta empresa?')) {
        try {
            const response = await fetch(`/techpix/excluirEmpresa/${id}`, {
                method: 'DELETE'
            });
            
            if (response.ok) {
                mostrarCards();
            } else {
                alert('Erro ao excluir empresa');
            }
        } catch (error) {
            console.error('Erro:', error);
            alert('Falha na comunicação com o servidor');
        }
    }
}

