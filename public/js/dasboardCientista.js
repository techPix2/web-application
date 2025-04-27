let periodoAtual = "DAY";
let tempoAtual = 30;
const id = sessionStorage.ID_FUNCIONARIO;
const cores = ['#4868A5', '#58A55C', '#F5B041', '#E74C3C', '#9B59B6', '#3498DB', '#1ABC9C', '#F1C40F'];

function carregarDados() {
    carregarGraficos();
    nome_usuario.innerHTML = sessionStorage.NOME_USUARIO;
}

async function buscarAlertas(quadrante) {
    const empresa = sessionStorage.ID_EMPRESA || 1;
    const resposta = await fetch(`/dashCientista/listarAlertasMaquinasPorQuadrante/${empresa}/${quadrante}/${periodoAtual}/${tempoAtual}`);
    return resposta.ok ? await resposta.json() : [];
}

async function carregarAlertasTodosQuadrantes() {
    const [q1, q2, q3, q4] = await Promise.all([
        buscarAlertas(1),
        buscarAlertas(2),
        buscarAlertas(3),
        buscarAlertas(4)
    ]);
    return [q1 || [], q2 || [], q3 || [], q4 || []];
}

function processarComponentes(quadrantes) {
    const resultado = [
        { RAM: 0, CPU: 0, Disco: 0 },
        { RAM: 0, CPU: 0, Disco: 0 },
        { RAM: 0, CPU: 0, Disco: 0 },
        { RAM: 0, CPU: 0, Disco: 0 }
    ];

    for (let i = 0; i < quadrantes.length; i++) {
        quadrantes[i].forEach(alerta => {
            const tipo = alerta.type || '';
            if (tipo.includes('RAM') || tipo.includes('Memory') || tipo.includes('Memória')) {
                resultado[i].RAM++;
            } else if (tipo.includes('CPU') || tipo.includes('Processador')) {
                resultado[i].CPU++;
            } else if (tipo.includes('Disk') || tipo.includes('Disco') || tipo.includes('Armazenamento')) {
                resultado[i].Disco++;
            }
        });
    }
    return resultado;
}

async function carregarGraficos() {
    const quadrantes = await carregarAlertasTodosQuadrantes();
    const componentes = processarComponentes(quadrantes);
    
    // Gráfico de alertas por quadrante
    new Chart(document.getElementById("alertaQuadrante"), {
        type: 'bar',
        data: {
            labels: ["Quadrante 1", "Quadrante 2", "Quadrante 3", "Quadrante 4"],
            datasets: [{
                label: "Quantidade Alertas",
                data: [quadrantes[0].length, quadrantes[1].length, quadrantes[2].length, quadrantes[3].length],
                backgroundColor: '#4868A5',
                borderColor: '#4868A5',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: { ticks: { color: '#ffffff' } },
                y: { ticks: { color: '#ffffff' } }
            }
        }
    });

    // Gráfico de componentes por quadrante
    new Chart(document.getElementById("alertaComponente"), {
        type: 'bar',
        data: {
            labels: ["Quadrante 1", "Quadrante 2", "Quadrante 3", "Quadrante 4"],
            datasets: [
                {
                    label: "RAM",
                    data: [componentes[0].RAM, componentes[1].RAM, componentes[2].RAM, componentes[3].RAM],
                    backgroundColor: '#4868A5',
                    borderColor: '#4868A5',
                    borderWidth: 2
                },
                {
                    label: "CPU",
                    data: [componentes[0].CPU, componentes[1].CPU, componentes[2].CPU, componentes[3].CPU],
                    backgroundColor: '#58A55C',
                    borderColor: '#58A55C',
                    borderWidth: 2
                },
                {
                    label: "Disco",
                    data: [componentes[0].Disco, componentes[1].Disco, componentes[2].Disco, componentes[3].Disco],
                    backgroundColor: '#F5B041',
                    borderColor: '#F5B041',
                    borderWidth: 2
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                x: { ticks: { color: '#ffffff' } },
                y: { ticks: { color: '#ffffff' } }
            }
        }
    });

    // Inicializa gráfico vazio de alertas por máquina
    window.graficoAlertasMaquina = new Chart(document.getElementById("alertaMaquina"), {
        type: 'bar',
        data: {
            labels: [],
            datasets: [
                {
                    label: "RAM",
                    data: [],
                    backgroundColor: '#4868A5',
                    borderColor: '#4868A5',
                    borderWidth: 2
                },
                {
                    label: "CPU",
                    data: [],
                    backgroundColor: '#58A55C',
                    borderColor: '#58A55C',
                    borderWidth: 2
                },
                {
                    label: "Disco",
                    data: [],
                    backgroundColor: '#F5B041',
                    borderColor: '#F5B041',
                    borderWidth: 2
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                x: { ticks: { color: '#ffffff' } },
                y: { ticks: { color: '#ffffff' } }
            }
        }
    });

    atualizarGraficoComponentesMaquina();
    atualizarGraficoAlertaMaquina();
}

async function verificarQuadranteComMaisAlertas() {
    const quadrantes = await carregarAlertasTodosQuadrantes();
    
    let melhorQuadrante = [];
    let maiorQuantidade = 0;

    for (let i = 0; i < quadrantes.length; i++) {
        if (quadrantes[i].length > maiorQuantidade) {
            maiorQuantidade = quadrantes[i].length;
            melhorQuadrante = quadrantes[i];
        }
    }

    maisAlertasQuadranteKPI.innerHTML = melhorQuadrante.length > 0 && melhorQuadrante[0].position 
        ? melhorQuadrante[0].position 
        : "N/A";

    return melhorQuadrante;
}

function processarDadosMaquinasQuadrante(alertas) {
    if (!alertas || alertas.length === 0) {
        return { labels: [], ram: [], cpu: [], disco: [] };
    }

    const maquinas = {};

    alertas.forEach(alerta => {
        if (!alerta.hostname) return;

        const nome = alerta.hostname;
        if (!maquinas[nome]) {
            maquinas[nome] = { ram: 0, cpu: 0, disco: 0 };
        }

        const tipo = alerta.type || '';
        if (tipo.includes('RAM') || tipo.includes('Memory') || tipo.includes('Memória')) {
            maquinas[nome].ram++;
        } else if (tipo.includes('CPU') || tipo.includes('Processador')) {
            maquinas[nome].cpu++;
        } else if (tipo.includes('Disk') || tipo.includes('Disco') || tipo.includes('Armazenamento')) {
            maquinas[nome].disco++;
        }
    });

    const nomes = Object.keys(maquinas).sort((a, b) => {
        const totalA = maquinas[a].ram + maquinas[a].cpu + maquinas[a].disco;
        const totalB = maquinas[b].ram + maquinas[b].cpu + maquinas[b].disco;
        return totalB - totalA;
    }).slice(0, 10);

    const dados = {
        labels: nomes,
        ram: [],
        cpu: [],
        disco: []
    };

    nomes.forEach(nome => {
        dados.ram.push(maquinas[nome].ram);
        dados.cpu.push(maquinas[nome].cpu);
        dados.disco.push(maquinas[nome].disco);
    });

    return dados;
}

async function atualizarGraficoAlertaMaquina() {
    const quadrante = await verificarQuadranteComMaisAlertas();
    
    if (!quadrante.length) return;

    const dados = processarDadosMaquinasQuadrante(quadrante);
    document.getElementById('quadranteAlerta').textContent = `Quadrante ${quadrante[0].position || 1}`;

    if (window.graficoAlertasMaquina) {
        window.graficoAlertasMaquina.destroy();
    }

    window.graficoAlertasMaquina = new Chart(document.getElementById("alertaMaquina"), {
        type: 'bar',
        data: {
            labels: dados.labels,
            datasets: [
                {
                    label: "RAM",
                    data: dados.ram,
                    backgroundColor: '#4868A5',
                    borderColor: '#4868A5',
                    borderWidth: 2
                },
                {
                    label: "CPU",
                    data: dados.cpu,
                    backgroundColor: '#58A55C',
                    borderColor: '#58A55C',
                    borderWidth: 2
                },
                {
                    label: "Disco",
                    data: dados.disco,
                    backgroundColor: '#F5B041',
                    borderColor: '#F5B041',
                    borderWidth: 2
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                x: { ticks: { color: '#ffffff' } },
                y: { ticks: { color: '#ffffff' } }
            }
        }
    });
}

async function buscarDados(url) {
    const resposta = await fetch(url);
    return resposta.ok ? await resposta.json() : [];
}

async function processarDadosGraficoLinha(dados, chaveId, chaveNome) {
    const itens = {};
    const datas = new Set();

    dados.forEach(item => {
        const id = item[chaveId];
        const nome = item[chaveNome];
        const data = new Date(item.dia).toLocaleDateString('pt-BR');

        if (!itens[id]) {
            itens[id] = { nome, alertas: {} };
        }

        itens[id].alertas[data] = item.totalAlertas;
        datas.add(data);
    });

    const datasOrdenadas = Array.from(datas).sort();
    const datasets = [];

    let i = 0;
    for (const id in itens) {
        const item = itens[id];
        const dados = datasOrdenadas.map(data => item.alertas[data] || 0);
        
        datasets.push({
            label: item.nome,
            data: dados,
            backgroundColor: cores[i % cores.length],
            borderColor: cores[i % cores.length],
            borderWidth: 2
        });
        i++;
    }

    return { labels: datasOrdenadas, datasets };
}

async function buscarAlertasPorMaquina(quadrante) {
    const empresa = sessionStorage.ID_EMPRESA || 1;
    const alertas = await buscarDados(`/dashCientista/listarAlertasPorMaquinaUltimos30Dias/${empresa}/${quadrante}`);
    return processarDadosGraficoLinha(alertas, 'idServer', 'hostname');
}

async function atualizarGraficoComponentesMaquina() {
    const quadrante = await verificarQuadranteComMaisAlertas();
    const quadranteNumero = quadrante.length > 0 && quadrante[0].position ? quadrante[0].position : 1;
    
    const dados = await buscarAlertasPorMaquina(quadranteNumero);
    document.getElementById('quadranteComponente').textContent = `Quadrante ${quadranteNumero}`;

    if (window.graficoComponentesMaquina) {
        window.graficoComponentesMaquina.destroy();
    }

    window.graficoComponentesMaquina = new Chart(document.getElementById("componenteMaquina"), {
        type: 'line',
        data: {
            labels: dados.labels,
            datasets: dados.datasets
        },
        options: {
            responsive: true,
            scales: {
                x: { ticks: { color: '#ffffff' } },
                y: { ticks: { color: '#ffffff' } }
            }
        }
    });
}

function verificarDiaDaSemana() {
    maisAlertasDiaKPI.innerHTML = "Segunda";
}

function encontrarComponenteMaisFrequente() {
    maisAlertasComponente.innerHTML = "CPU";
}

function sair() {
    sessionStorage.removeItem("EMAIL_USUARIO");
    sessionStorage.removeItem("ID_FUNCIONARIO");
    sessionStorage.removeItem("NOME_USUARIO");
    sessionStorage.removeItem("ID_EMPRESA");
    window.location.href = "../index.html";
}