document.addEventListener("DOMContentLoaded", function() {
    const nomeUsuario = document.getElementById('nome_usuario');
    const listaServidores = document.getElementById('lista-servidores');
    const loadingElement = document.getElementById('loading-servidores');
    const modal = document.getElementById('modal-detalhes');
    const btnFecharModal = document.querySelector('.fechar-modal');
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
                cor = 'white';
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
    let chartUsoCpu, chartFreqCpu, chartPizza2, chartPizza3, chartRamUso, chartRamPorcentagem, chartRedeEnviados, chartRedeRecebidos;

    inicializarGraficos();

    setInterval(atualizarGraficos, 5000);

    function inicializarGraficos() {
        chartUsoCpu = new Chart(document.getElementById('usoCpu'), {
            type: 'line',
            data: {
                labels: ['10:00', '10:05', '10:10', '10:15', '10:20'],
                datasets: [{
                    label: 'Uso da CPU (%)',
                    data: [20, 45, 35, 60, 40],
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.3
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100
                    }
                }
            }
        });

        chartFreqCpu = new Chart(document.getElementById('freqCpu'), {
            type: 'line',
            data: {
                labels: ['10:00', '10:05', '10:10', '10:15', '10:20'],
                datasets: [{
                    label: 'Frequência (GHz)',
                    data: [2.2, 2.4, 2.6, 2.3, 2.5],
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.3
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        suggestedMax: 3.5
                    }
                }
            }
        });

        chartPizza2 = new Chart(document.getElementById('pizza2'), {
            type: 'doughnut',
            data: {
                labels: ['Usado (GB)', 'Disponível (GB)'],
                datasets: [{
                    label: 'Armazenamento',
                    data: [180, 320],
                    backgroundColor: ['#FF6384', '#36A2EB'],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true
            }
        });

        chartPizza3 = new Chart(document.getElementById('pizza3'), {
            type: 'doughnut',
            data: {
                labels: ['Usado (GB)', 'Disponível (GB)'],
                datasets: [{
                    label: 'Swap',
                    data: [2, 6],
                    backgroundColor: ['#FFCE56', '#4BC0C0'],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true
            }
        });

        chartRamUso = new Chart(document.getElementById('ramUso'), {
            type: 'doughnut',
            data: {
                labels: ['Usada (GB)', 'Disponível (GB)'],
                datasets: [{
                    data: [6, 10],
                    backgroundColor: ['#FF6384', '#36A2EB']
                }]
            },
            options: {
                responsive: true
            }
        });

        chartRamPorcentagem = new Chart(document.getElementById('ramPorcentagem'), {
            type: 'bar',
            data: {
                labels: ['Porcentagem de Uso'],
                datasets: [{
                    label: '% RAM usada',
                    data: [37.5],
                    backgroundColor: ['#4BC0C0']
                }]
            },
            options: {
                responsive: true,
                indexAxis: 'y',
                scales: {
                    x: {
                        max: 100
                    }
                }
            }
        });

        chartRedeEnviados = new Chart(document.getElementById('redeEnviados'), {
            type: 'bar',
            data: {
                labels: ['Enviados'],
                datasets: [{
                    label: 'Pacotes (mil)',
                    data: [120],
                    backgroundColor: ['#9966FF']
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });

        chartRedeRecebidos = new Chart(document.getElementById('redeRecebidos'), {
            type: 'bar',
            data: {
                labels: ['Recebidos'],
                datasets: [{
                    label: 'Pacotes (mil)',
                    data: [145],
                    backgroundColor: ['#FF9F40']
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    function atualizarGraficos() {
        const agora = new Date();
        const horaAtual = `${agora.getHours()}:${agora.getMinutes().toString().padStart(2, '0')}`;

        chartUsoCpu.data.labels.push(horaAtual);
        chartUsoCpu.data.labels.shift();
        chartUsoCpu.data.datasets[0].data.push(Math.floor(Math.random() * 100));
        chartUsoCpu.data.datasets[0].data.shift();
        chartUsoCpu.update();

        chartFreqCpu.data.labels.push(horaAtual);
        chartFreqCpu.data.labels.shift();
        chartFreqCpu.data.datasets[0].data.push((Math.random() * 1.5 + 2).toFixed(1));
        chartFreqCpu.data.datasets[0].data.shift();
        chartFreqCpu.update();

        const totalStorage = 500;
        const usedStorage = Math.floor(Math.random() * 300 + 100);
        chartPizza2.data.datasets[0].data = [usedStorage, totalStorage - usedStorage];
        chartPizza2.update();

        const totalSwap = 8;
        const usedSwap = Math.floor(Math.random() * 6 + 1);
        chartPizza3.data.datasets[0].data = [usedSwap, totalSwap - usedSwap];
        chartPizza3.update();

        // Atualizar gráfico de RAM usada
        const totalRam = 16;
        const usedRam = Math.floor(Math.random() * 12 + 2);
        chartRamUso.data.datasets[0].data = [usedRam, totalRam - usedRam];
        chartRamUso.update();

        // Atualizar gráfico de porcentagem de RAM
        const ramPercentage = (usedRam / totalRam) * 100;
        chartRamPorcentagem.data.datasets[0].data = [ramPercentage.toFixed(1)];
        chartRamPorcentagem.update();

        // Atualizar gráfico de pacotes enviados
        chartRedeEnviados.data.datasets[0].data = [Math.floor(Math.random() * 200 + 50)];
        chartRedeEnviados.update();

        // Atualizar gráfico de pacotes recebidos
        chartRedeRecebidos.data.datasets[0].data = [Math.floor(Math.random() * 200 + 50)];
        chartRedeRecebidos.update();
    }
        }

    }
);
