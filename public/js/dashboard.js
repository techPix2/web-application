document.addEventListener("DOMContentLoaded", function() {
    const nomeUsuario = document.getElementById('nome_usuario');
    const listaServidores = document.getElementById('lista-servidores');
    const loadingElement = document.getElementById('loading-servidores');
    const modal = document.getElementById('modal-detalhes');
    const btnFecharModal = document.querySelector('.fechar-modal');
    // KPIs
    const totalAlertasElement = document.getElementById('total-alertas');
    const percentSemAlertasElement = document.getElementById('percent-sem-alertas');
    const percentComAlertasElement = document.getElementById('percent-com-alertas');

  
    carregarDadosIniciais();

    async function carregarDadosIniciais() {
        try {
            exibirDadosUsuario();
            await carregarServidores();
            configurarEventos();
            carregarGraficos();
        } catch (erro) {
            console.error("Erro ao carregar dados:", erro);
            mostrarErro("Falha ao carregar dados do servidor");
        }
    }

    function exibirDadosUsuario() {
        const nome = sessionStorage.getItem('NOME_USUARIO') || 'Usuário';
        nomeUsuario.textContent = nome;
    }

    async function carregarServidores() {
        mostrarLoading(true);
        
        try {
            const idEmpresa = sessionStorage.getItem('ID_EMPRESA');
            if (!idEmpresa) throw new Error("ID da empresa não encontrado");

            const resposta = await fetch(`/dashAnalista/servidores/${idEmpresa}`);
            if (!resposta.ok) throw new Error("Erro na resposta da API");

            const servidores = await resposta.json();
            atualizarListaServidores(servidores);
            atualizarKPIs(servidores);
        } finally {
            mostrarLoading(false);
        }
    }

    function atualizarListaServidores(servidores) {
        listaServidores.innerHTML = servidores.map(servidor => {

            let cor, texto;
            const totalAlertas = servidor.totalAlertas || 0;
            
            if (totalAlertas === 0) {
                cor = 'grey';
                texto = 'Normal';
            } else if (totalAlertas === 1) {
                cor = 'yellow'; 
                texto = 'Atenção';
            } else {
                cor = 'red';
                texto = 'Crítico';
            }

            return `
                <div class="servidor" data-id="${servidor.idServer}">
                    <div class="nome"><p>${servidor.hostName}</p></div>
                    <div class="ip"><p>${servidor.macAddress}</p></div>
                    <div class="localizacao"><p>Posição ${servidor.position}</p></div>
                    <div class="status"><p>${totalAlertas}</p></div>
                    <div class="situacao">
                        <p style="color: ${cor}; font-weight: bold;">${texto}</p>
                    </div>
                    <div class="hardware">
                        <button class="btn-visualizar">Visualizar</button>
                    </div>
                </div>
            `;
        }).join('');
    }

    function atualizarKPIs(servidores) {
        const totalServidores = servidores.length;
        const servidoresComAlertas = servidores.filter(s => (s.totalAlertas || 0) > 0).length;
        const totalAlertas = servidores.reduce((sum, s) => sum + (s.totalAlertas || 0), 0);
        
        totalAlertasElement.textContent = totalAlertas;
        percentComAlertasElement.textContent = totalServidores > 0 
            ? `${Math.round((servidoresComAlertas / totalServidores) * 100)}%` 
            : '0%';
        percentSemAlertasElement.textContent = totalServidores > 0 
            ? `${Math.round(((totalServidores - servidoresComAlertas) / totalServidores) * 100)}%` 
            : '100%';
    }

    function configurarEventos() {
        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('btn-visualizar')) {
                const idServidor = e.target.closest('.servidor').dataset.id;
                abrirModalDetalhes(idServidor);
            }
        });

        btnFecharModal.addEventListener('click', fecharModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) fecharModal();
        });
    }

    function abrirModalDetalhes(idServidor) {
        console.log("Abrindo modal para servidor:", idServidor);
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    function fecharModal() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    function mostrarLoading(mostrar) {
        loadingElement.style.display = mostrar ? 'block' : 'none';
        listaServidores.style.opacity = mostrar ? 0.5 : 1;
    }

    function mostrarErro(mensagem) {
        listaServidores.innerHTML = `<div class="erro">${mensagem}</div>`;
    }

    function carregarGraficos() {
    }
});