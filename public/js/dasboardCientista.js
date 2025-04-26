
async function carregarGraficos(){
    const alertaQuadrante = document.getElementById("alertaQuadrante")
    const alertaComponente = document.getElementById("alertaComponente")
    const componenteMaquina = document.getElementById("componenteMaquina")
    const alertasMaquina = document.getElementById("alertaMaquina")
    let quadrantes = await carregarAlertasTodosQuadrantes();
    let componentesPorQuadrante = await processarComponentesPorQuadrante(quadrantes);

    new Chart(alertaQuadrante, {
        type: 'bar',
        data: {
            labels: ["Quadrante 1", "Quadrante 2", "Quadrante 3", "Quadrante 4"],
            datasets: [{
                label: "Quantidade Alertas",
                data: [quadrantes[0].length, quadrantes[1].length, quadrantes[2].length, quadrantes[3].length],
                backgroundColor: ['#4868A5'],
                borderColor: '#4868A5',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#ffffff',
                        font: {
                            size: 18
                        }
                    }
                }
            },
            scales: {
                x: {
                    stacked: false,
                    ticks: {
                        color: '#ffffff'
                    }
                },
                y: {
                    ticks: {
                        color: '#ffffff'
                    }
                }
            }
        }
    });  
    new Chart(alertaComponente, {
        type: 'bar',
        data: {
            labels: ["Quadrante 1", "Quadrante 2", "Quadrante 3", "Quadrante 4"],
            datasets: [
                {
                    label: "RAM",
                    data: [
                        componentesPorQuadrante[0].RAM || 0,
                        componentesPorQuadrante[1].RAM || 0,
                        componentesPorQuadrante[2].RAM || 0,
                        componentesPorQuadrante[3].RAM || 0
                    ],
                    backgroundColor: '#4868A5',
                    borderColor: '#4868A5',
                    borderWidth: 2
                },
                {
                    label: "CPU",
                    data: [
                        componentesPorQuadrante[0].CPU || 0,
                        componentesPorQuadrante[1].CPU || 0,
                        componentesPorQuadrante[2].CPU || 0,
                        componentesPorQuadrante[3].CPU || 0
                    ],
                    backgroundColor: '#58A55C',
                    borderColor: '#58A55C',
                    borderWidth: 2
                },
                {
                    label: "Disco",
                    data: [
                        componentesPorQuadrante[0].Disco || 0,
                        componentesPorQuadrante[1].Disco || 0,
                        componentesPorQuadrante[2].Disco || 0,
                        componentesPorQuadrante[3].Disco || 0
                    ],
                    backgroundColor: '#F5B041',
                    borderColor: '#F5B041',
                    borderWidth: 2
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#ffffff',
                        font: {
                            size: 18
                        }
                    }
                }
            },
            scales: {
                x: {
                    stacked: false,
                    ticks: {
                        color: '#ffffff'
                    }
                },
                y: {
                    ticks: {
                        color: '#ffffff'
                    }
                }
            }
        }
    });

    window.graficoAlertasMaquina = new Chart(alertasMaquina, {
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
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#ffffff',
                        font: {
                            size: 18
                        }
                    }
                }
            },
            scales: {
                x: {
                    stacked: false,
                    ticks: {
                        color: '#ffffff'
                    }
                },
                y: {
                    ticks: {
                        color: '#ffffff'
                    }
                }
            }
        }
    });

    atualizarGraficoComponentesMaquina();
    atualizarGraficoAlertaMaquina();
}



const id = sessionStorage.ID_FUNCIONARIO;


async function listarAlertasMaquinasPorQuadrante(fk_company, quadrante, periodo, tempo) {
    let data;
    try {
        const response = await fetch(`/dashCientista/listarAlertasMaquinasPorQuadrante/${fk_company}/${quadrante}/${periodo}/${tempo}`);
        data = await response.json();
        return data
    } catch (err) {
        console.error(err);
        return {
            position: `${quadrante}`,
            length: 0
        };
    }
}


function listarAlertasPorComponentePorMaquina(fk_company, quadrante, periodo, tempo){
    fetch(`/dashCientista/listarAlertasPorComponentePorMaquina/${fk_company}/${quadrante}/${periodo}/${tempo}`,{
        method:"GET"
    }).then((res) => {
        res.json().then((json)=>{
            console.log(json)
        });
    })
    .catch((err) => {
        console.log(err)
    })
}

async function carregarAlertasTodosQuadrantes(){
    const fk_company = sessionStorage.ID_EMPRESA || 1;
    const fk_periodo = periodoAtual;
    const tempo = tempoAtual;
    const [q1, q2, q3, q4] = await Promise.all([
        listarAlertasMaquinasPorQuadrante(fk_company, 1, fk_periodo, tempo),
        listarAlertasMaquinasPorQuadrante(fk_company, 2, fk_periodo, tempo),
        listarAlertasMaquinasPorQuadrante(fk_company, 3, fk_periodo, tempo),
        listarAlertasMaquinasPorQuadrante(fk_company, 4, fk_periodo, tempo)
    ]);
    retorno = [q1, q2, q3, q4]
    return retorno;
}

async function verificarQuadranteComMaisAlertas(){
    var quadrantes =  await carregarAlertasTodosQuadrantes()
    let quadranteMaisAlertas = quadrantes[0]
    for (let i = 1; i < quadrantes.length; i++) {
        if (quadrantes[i].length > quadranteMaisAlertas.length){
            quadranteMaisAlertas = quadrantes[i]
        }
    }
    maisAlertasQuadranteKPI.innerHTML= quadranteMaisAlertas[0].position
    return quadranteMaisAlertas
}
async function verificarDiaDaSemana(){
    let quadrante = await verificarQuadranteComMaisAlertas()
    const diaSemanaQuantidade= [0,0,0,0,0,0,0]
    for (let i = 1; i < quadrante.length; i++) {
        const data = new Date(quadrante[i].dateTime).getDay()
        diaSemanaQuantidade[data]+=1
    }
    let maior = diaSemanaQuantidade[0]
    for (let i = 1; i < quadrante.length; i++) {
        if (diaSemanaQuantidade[i] > maior){
            maior = diaSemanaQuantidade[i]
        }
    }
    indice = diaSemanaQuantidade.indexOf(maior)
    switch (indice) {
        case 0:
            maisAlertasDiaKPI.innerHTML = "Domingo"
            break
        case 1:
            maisAlertasDiaKPI.innerHTML =  "Segunda"
            break

        case 2:
            maisAlertasDiaKPI.innerHTML =  "Terça"
            break

        case 3:
            maisAlertasDiaKPI.innerHTML =  "Quarta"
            break

        case 4:
            maisAlertasDiaKPI.innerHTML =  "Quinta"
            break

        case 5:
            maisAlertasDiaKPI.innerHTML =  "Sexta"
            break

        case 6:
            maisAlertasDiaKPI.innerHTML =  "Sábado"
            break
    }
}

async function encontrarComponenteMaisFrequente() {
    let quadrante = await verificarQuadranteComMaisAlertas()
    const contador = {};

    quadrante.forEach(item => {
        const tipo = item.type;
        if (tipo) {
            contador[tipo] = (contador[tipo] || 0) + 1;
        }
    });

    let tipoMaisFrequente = null;
    let maiorContagem = 0;

    for (const tipo in contador) {
        if (contador[tipo] > maiorContagem) {
            maiorContagem = contador[tipo];
            tipoMaisFrequente = tipo;
        }
    }

    maisAlertasComponente.innerHTML = tipoMaisFrequente;
}

async function processarComponentesPorQuadrante(quadrantes) {

    const componentesPorQuadrante = [
        { RAM: 0, CPU: 0, Disco: 0, Processos: 0 },
        { RAM: 0, CPU: 0, Disco: 0, Processos: 0 },
        { RAM: 0, CPU: 0, Disco: 0, Processos: 0 },
        { RAM: 0, CPU: 0, Disco: 0, Processos: 0 }
    ];
    console.log(quadrantes)
    for (let i = 0; i < quadrantes.length; i++) {
        const quadrante = quadrantes[i];

        quadrante.forEach(alerta => {
            const tipo = alerta.type || '';
            const componentName = alerta.componentName || '';

            if (tipo.includes('Memória') || tipo.includes('Memory')) {
                componentesPorQuadrante[i].RAM += 1;
            } else if (tipo.includes('Processador') || tipo.includes('CPU')) {
                componentesPorQuadrante[i].CPU += 1;
            } else if (tipo.includes('Armazenamento') || tipo.includes('Disk')) {
                componentesPorQuadrante[i].Disco += 1;
            }
        });
    }
    return componentesPorQuadrante;
}


function carregarDados() {
    carregarGraficos();
    nome_usuario.innerHTML = sessionStorage.NOME_USUARIO;
    carregarMaquinas();

    const botoes = document.querySelectorAll('.buttonFiltro');
    if (botoes.length > 0) {
        botoes[0].style.backgroundColor = 'var(--azulEscuro)';
        botoes[0].style.color = 'white';
    }
}

async function carregarMaquinas() {
    const filtroMaquina = document.getElementById("filtroMaquina");

    filtroMaquina.innerHTML = '<option value="#" selected disabled>Selecione uma máquina para monitorar</option>';

    try {
        const fk_company = sessionStorage.ID_EMPRESA || 1;

        const response = await fetch(`/dashCientista/listarMaquinas/${fk_company}`);
        const maquinas = await response.json();

        maquinas.forEach(maquina => {
            const option = document.createElement('option');
            option.value = maquina.idServer;
            option.textContent = maquina.hostname;
            filtroMaquina.appendChild(option);
        });

        filtroMaquina.addEventListener('change', atualizarGraficosMaquina);
    } catch (error) {
        console.error("Erro ao carregar máquinas:", error);
    }
}

async function atualizarGraficosMaquina() {
    const filtroMaquina = document.getElementById("filtroMaquina");
    const idMaquina = filtroMaquina.value;

    if (idMaquina === "#") return;

    try {
        const fk_company = sessionStorage.ID_EMPRESA || 1;
        const periodo = periodoAtual;
        const tempo = tempoAtual;


        const response = await fetch(`/dashCientista/listarAlertasPorComponentePorMaquina/${fk_company}/${idMaquina}/${periodo}/${tempo}`);
        const alertas = await response.json();

        atualizarGraficoComponentesPorHora(alertas);
        atualizarGraficoAlertasMaquina(alertas);
    } catch (error) {
        console.error("Erro ao atualizar gráficos da máquina:", error);
    }
}

function atualizarGraficoComponentesPorHora(alertas) {
    const componenteMaquina = document.getElementById("componenteMaquina");
    const dadosProcessados = processarDadosComponentesMaquina(alertas);

    if (window.graficoComponentesMaquina) {
        window.graficoComponentesMaquina.destroy();
    }

    window.graficoComponentesMaquina = new Chart(componenteMaquina, {
        type: 'line',
        data: {
            labels: dadosProcessados.labels,
            datasets: [
                {
                    label: "RAM",
                    data: dadosProcessados.ram,
                    backgroundColor: '#4868A5',
                    borderColor: '#4868A5',
                    borderWidth: 2
                },
                {
                    label: "CPU",
                    data: dadosProcessados.cpu,
                    backgroundColor: '#58A55C',
                    borderColor: '#58A55C',
                    borderWidth: 2
                },
                {
                    label: "Disco",
                    data: dadosProcessados.disco,
                    backgroundColor: '#F5B041',
                    borderColor: '#F5B041',
                    borderWidth: 2
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#ffffff',
                        font: {
                            size: 18
                        }
                    }
                }
            },
            scales: {
                x: {
                    stacked: false,
                    ticks: {
                        color: '#ffffff'
                    }
                },
                y: {
                    ticks: {
                        color: '#ffffff'
                    }
                }
            }
        }
    });
}

async function atualizarGraficoComponentesMaquina() {
    try {
        const quadranteMaisAlertas = await verificarQuadranteComMaisAlertas();
        const quadrante = quadranteMaisAlertas[0].position;

        const dadosProcessados = await buscarAlertasPorMaquinaUltimos30Dias(quadrante);

        const componenteMaquina = document.getElementById("componenteMaquina");

        if (window.graficoComponentesMaquina) {
            window.graficoComponentesMaquina.destroy();
        }

        window.graficoComponentesMaquina = new Chart(componenteMaquina, {
            type: 'line',
            data: {
                labels: dadosProcessados.labels,
                datasets: dadosProcessados.datasets
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: `Alertas por máquina (Quadrante ${quadrante})`,
                        color: '#ffffff',
                        font: {
                            size: 16
                        }
                    },
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: '#ffffff',
                            font: {
                                size: 14
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        stacked: false,
                        ticks: {
                            color: '#ffffff'
                        }
                    },
                    y: {
                        ticks: {
                            color: '#ffffff'
                        }
                    }
                }
            }
        });
    } catch (error) {
        console.error("Erro ao atualizar gráfico de componentes da máquina:", error);
    }
}

function atualizarGraficoAlertasMaquina(alertas) {
    const alertasMaquina = document.getElementById("alertaMaquina");

    const dadosProcessados = processarDadosAlertasMaquina(alertas);

    if (window.graficoAlertasMaquina) {
        window.graficoAlertasMaquina.destroy();
    }

    window.graficoAlertasMaquina = new Chart(alertasMaquina, {
        type: 'line',
        data: {
            labels: dadosProcessados.labels,
            datasets: [
                {
                    label: "RAM",
                    data: dadosProcessados.ram,
                    backgroundColor: '#4868A5',
                    borderColor: '#4868A5',
                    borderWidth: 2
                },
                {
                    label: "CPU",
                    data: dadosProcessados.cpu,
                    backgroundColor: '#58A55C',
                    borderColor: '#58A55C',
                    borderWidth: 2
                },
                {
                    label: "Disco",
                    data: dadosProcessados.disco,
                    backgroundColor: '#F5B041',
                    borderColor: '#F5B041',
                    borderWidth: 2
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#ffffff',
                        font: {
                            size: 18
                        }
                    }
                }
            },
            scales: {
                x: {
                    stacked: false,
                    ticks: {
                        color: '#ffffff'
                    }
                },
                y: {
                    ticks: {
                        color: '#ffffff'
                    }
                }
            }
        }
    });
}

async function atualizarGraficoAlertaMaquina() {
    try {
        const quadranteMaisAlertas = await verificarQuadranteComMaisAlertas();
        const quadrante = quadranteMaisAlertas[0].position;

        const alertasQuadrante = quadranteMaisAlertas;

        const dadosProcessados = processarDadosMaquinasQuadrante(alertasQuadrante);

        const alertasMaquina = document.getElementById("alertaMaquina");

        if (window.graficoAlertasMaquina) {
            window.graficoAlertasMaquina.destroy();
        }

        window.graficoAlertasMaquina = new Chart(alertasMaquina, {
            type: 'bar',
            data: {
                labels: dadosProcessados.labels,
                datasets: [
                    {
                        label: "RAM",
                        data: dadosProcessados.ram,
                        backgroundColor: '#4868A5',
                        borderColor: '#4868A5',
                        borderWidth: 2
                    },
                    {
                        label: "CPU",
                        data: dadosProcessados.cpu,
                        backgroundColor: '#58A55C',
                        borderColor: '#58A55C',
                        borderWidth: 2
                    },
                    {
                        label: "Disco",
                        data: dadosProcessados.disco,
                        backgroundColor: '#F5B041',
                        borderColor: '#F5B041',
                        borderWidth: 2
                    }
                ]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: `Alertas por máquina (Quadrante ${quadrante})`,
                        color: '#ffffff',
                        font: {
                            size: 16
                        }
                    },
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: '#ffffff',
                            font: {
                                size: 18
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        stacked: false,
                        ticks: {
                            color: '#ffffff'
                        }
                    },
                    y: {
                        ticks: {
                            color: '#ffffff'
                        }
                    }
                }
            }
        });
    } catch (error) {
        console.error("Erro ao atualizar gráfico de alertas por máquina:", error);
    }
}

function processarDadosMaquinasQuadrante(alertasQuadrante) {
    const alertasPorMaquina = {};

    alertasQuadrante.forEach(alerta => {
        if (!alerta.hostname) return;

        const nomeMaquina = alerta.hostname;

        if (!alertasPorMaquina[nomeMaquina]) {
            alertasPorMaquina[nomeMaquina] = { ram: 0, cpu: 0, disco: 0 };
        }

        const tipo = alerta.type || '';

        if (tipo.includes('Memória') || tipo.includes('Memory') || tipo.includes('RAM')) {
            alertasPorMaquina[nomeMaquina].ram += 1;
        } else if (tipo.includes('Processador') || tipo.includes('CPU')) {
            alertasPorMaquina[nomeMaquina].cpu += 1;
        } else if (tipo.includes('Armazenamento') || tipo.includes('Disk') || tipo.includes('Disco')) {
            alertasPorMaquina[nomeMaquina].disco += 1;
        }
    });

    const maquinasOrdenadas = Object.keys(alertasPorMaquina).sort((a, b) => {
        const totalA = alertasPorMaquina[a].ram + alertasPorMaquina[a].cpu + alertasPorMaquina[a].disco;
        const totalB = alertasPorMaquina[b].ram + alertasPorMaquina[b].cpu + alertasPorMaquina[b].disco;
        return totalB - totalA;
    });

    const maquinasLimitadas = maquinasOrdenadas.slice(0, 10);

    const dados = {
        labels: maquinasLimitadas,
        ram: [],
        cpu: [],
        disco: []
    };

    maquinasLimitadas.forEach(maquina => {
        dados.ram.push(alertasPorMaquina[maquina].ram);
        dados.cpu.push(alertasPorMaquina[maquina].cpu);
        dados.disco.push(alertasPorMaquina[maquina].disco);
    });

    return dados;
}

function processarDadosComponentesMaquina(alertas) {
    const alertasPorHora = {};

    alertas.forEach(alerta => {
        const data = new Date(alerta.dateTime);
        const hora = `${data.getHours()}:00`;

        if (!alertasPorHora[hora]) {
            alertasPorHora[hora] = { ram: 0, cpu: 0, disco: 0, processos: 0 };
        }

        const tipo = alerta.type;
        if (tipo) {
            if (tipo.includes('RAM') || tipo.includes('Memory')) {
                alertasPorHora[hora].ram += 1;
            } else if (tipo.includes('CPU') ) {
                alertasPorHora[hora].cpu += 1;
            } else if (tipo.includes('Disco') || tipo.includes('Disk')) {
                alertasPorHora[hora].disco += 1;
            }
        }
    });

    const horas = Object.keys(alertasPorHora).sort((a, b) => {
        return parseInt(a) - parseInt(b);
    });

    const dados = {
        labels: horas,
        ram: [],
        cpu: [],
        disco: [],
        processos: []
    };

    horas.forEach(hora => {
        dados.ram.push(alertasPorHora[hora].ram);
        dados.cpu.push(alertasPorHora[hora].cpu);
        dados.disco.push(alertasPorHora[hora].disco);
        dados.processos.push(alertasPorHora[hora].processos);
    });

    return dados;
}

async function buscarAlertasPorMaquinaUltimos30Dias(quadrante) {
    try {
        const fk_company = sessionStorage.ID_EMPRESA || 1;
        const response = await fetch(`/dashCientista/listarAlertasPorMaquinaUltimos30Dias/${fk_company}/${quadrante}`);
        const alertas = await response.json();
        return processarDadosAlertasPorMaquina(alertas);
    } catch (error) {
        console.error("Erro ao buscar alertas por máquina nos últimos 30 dias:", error);
        return { labels: [], datasets: [] };
    }
}

function processarDadosAlertasPorMaquina(alertas) {
    const maquinas = {};
    const todasDatas = new Set();
    alertas.forEach(alerta => {
        const idMaquina = alerta.idServer;
        const nomeMaquina = alerta.hostname || `M${idMaquina}`;
        let data = new Date(alerta.dia);
        data = data.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            timeZone: 'UTC'
        });

        if (!maquinas[idMaquina]) {
            maquinas[idMaquina] = {
                id: idMaquina,
                nome: nomeMaquina,
                alertasPorDia: {}
            };
        }

        maquinas[idMaquina].alertasPorDia[data] = alerta.totalAlertas;
        todasDatas.add(data);
    });

    const datasOrdenadas = Array.from(todasDatas).sort();

    const datasets = [];
    const cores = ['#4868A5', '#58A55C', '#F5B041', '#E74C3C', '#9B59B6', '#3498DB', '#1ABC9C', '#F1C40F'];

    let i = 0;
    for (const idMaquina in maquinas) {
        const maquina = maquinas[idMaquina];
        const dadosMaquina = [];

        datasOrdenadas.forEach(data => {
            dadosMaquina.push(maquina.alertasPorDia[data] || 0);
        });

        datasets.push({
            label: maquina.nome,
            data: dadosMaquina,
            backgroundColor: cores[i % cores.length],
            borderColor: cores[i % cores.length],
            borderWidth: 2
        });

        i++;
    }

    return {
        labels: datasOrdenadas,
        datasets: datasets
    };
}

function processarDadosAlertasMaquina(alertas) {
    const alertasPorHora = {};

    alertas.forEach(alerta => {
        const data = new Date(alerta.dateTime);
        const hora = `${data.getHours()}:00`;

        if (!alertasPorHora[hora]) {
            alertasPorHora[hora] = { ram: 0, cpu: 0, disco: 0, processos: 0 };
        }

        const tipo = alerta.type;
        if (tipo) {
            if (tipo.includes('RAM') || tipo.includes('Memory')) {
                alertasPorHora[hora].ram += 1;
            } else if (tipo.includes('CPU')) {
                alertasPorHora[hora].cpu += 1;
            } else if (tipo.includes('Disco') || tipo.includes('Disk')) {
                alertasPorHora[hora].disco += 1;
            } else if (tipo.includes('Processo') || tipo.includes('Process')) {
                alertasPorHora[hora].processos += 1;
            }
        }
    });

    const horas = Object.keys(alertasPorHora).sort((a, b) => {
        return parseInt(a) - parseInt(b);
    });

    const dados = {
        labels: horas,
        ram: [],
        cpu: [],
        disco: [],
        processos: []
    };

    horas.forEach(hora => {
        dados.ram.push(alertasPorHora[hora].ram);
        dados.cpu.push(alertasPorHora[hora].cpu);
        dados.disco.push(alertasPorHora[hora].disco);
        dados.processos.push(alertasPorHora[hora].processos);
    });

    return dados;
}
let periodoAtual = "HOUR";
let tempoAtual = 30;

function filtrarPorPeriodo(periodo, tempo) {
    periodoAtual = periodo;
    tempoAtual = tempo;

    carregarGraficos();
    verificarQuadranteComMaisAlertas();
    verificarDiaDaSemana();
    encontrarComponenteMaisFrequente();
    atualizarGraficoAlertaMaquina();

    const filtroMaquina = document.getElementById("filtroMaquina");
    if (filtroMaquina && filtroMaquina.value !== "#") {
        atualizarGraficosMaquina();
    }

    const botoes = document.querySelectorAll('.buttonFiltro');
    botoes.forEach(btn => {
        btn.style.backgroundColor = '';
        btn.style.color = '';
    });

    const botaoClicado = event.target;
    botaoClicado.style.backgroundColor = 'var(--azulEscuro)';
    botaoClicado.style.color = 'white';
}

function sair() {
    sessionStorage.removeItem("EMAIL_USUARIO");
    sessionStorage.removeItem("ID_FUNCIONARIO");
    sessionStorage.removeItem("NOME_USUARIO");
    sessionStorage.removeItem("ID_EMPRESA");
    window.location.href = "../index.html";
}
