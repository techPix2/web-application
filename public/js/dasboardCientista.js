
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
    try {
        const resposta = await fetch(`/dashCientista/listarAlertasMaquinasPorQuadrante/${empresa}/${quadrante}/${periodoAtual}/${tempoAtual}`);
        return await resposta.json();
    } catch (erro) {
        console.log(erro);
    }
}

async function carregarAlertasTodosQuadrantes() {
    const q1 = await buscarAlertas(1);
    const q2 = await buscarAlertas(2);
    const q3 = await buscarAlertas(3);
    const q4 = await buscarAlertas(4);
    return [q1, q2, q3, q4];
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
            const tipo = alerta.type;
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
    let melhorQuadrante = quadrantes[0];
    
    for (let i = 1; i < quadrantes.length; i++) {
        if (quadrantes[i].length > melhorQuadrante.length) {
            melhorQuadrante = quadrantes[i];
        }
    }
    maisAlertasQuadranteKPI.innerHTML = melhorQuadrante[0].position;
    return melhorQuadrante;
}

function processarDadosMaquinasQuadrante(alertas) {
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
    const dados = processarDadosMaquinasQuadrante(quadrante);
    
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

async function buscarAlertasPorMaquina(quadrante) {
    const empresa = sessionStorage.ID_EMPRESA || 1;
    try {
        const resposta = await fetch(`/dashCientista/listarAlertasPorMaquinaUltimos30Dias/${empresa}/${quadrante}`);
        const alertas = await resposta.json();
        
        const maquinas = {};
        const datas = new Set();
        
        alertas.forEach(alerta => {
            const id = alerta.idServer;
            const nome = alerta.hostname;
            const data = new Date(alerta.dia).toLocaleDateString('pt-BR');
            
            if (!maquinas[id]) {
                maquinas[id] = { nome: nome, alertas: {} };
            }
            
            maquinas[id].alertas[data] = alerta.totalAlertas;
            datas.add(data);
        });
        
        const datasOrdenadas = Array.from(datas).sort();
        const datasets = [];
        
        let i = 0;
        for (const id in maquinas) {
            const maquina = maquinas[id];
            const dados = [];
            
            datasOrdenadas.forEach(data => {
                dados.push(maquina.alertas[data] || 0);
            });
            datasets.push({
                label: maquina.nome,
                data: dados,
                backgroundColor: cores[i % cores.length],
                borderColor: cores[i % cores.length],
                borderWidth: 2
            });
            i++;
        }
        
        return { labels: datasOrdenadas, datasets: datasets };
    } catch (erro) {
        console.log(erro);
        return { labels: [], datasets: [] };
    }
}

async function atualizarGraficoComponentesMaquina() {
    const quadrante = await verificarQuadranteComMaisAlertas();
    const dados = await buscarAlertasPorMaquina(quadrante[0].position);
    
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

function sair() {
    sessionStorage.removeItem("EMAIL_USUARIO");
    sessionStorage.removeItem("ID_FUNCIONARIO");
    sessionStorage.removeItem("NOME_USUARIO");
    sessionStorage.removeItem("ID_EMPRESA");
    window.location.href = "../index.html";
}