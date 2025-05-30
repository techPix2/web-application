// Variáveis globais para armazenar os tempos e estados
const resourceTimers = {
    cpu: {
        currentTime: 0,      // Tempo atual da sessão
        isExceeded: false,   // Flag de excedência
        interval: null,      // Referência do intervalo
        element: null        // Elemento HTML da KPI
    },
    ram: {
        currentTime: 0,
        isExceeded: false,
        interval: null,
        element: null
    },
    disk: {
        currentTime: 0,
        isExceeded: false,
        interval: null,
        element: null
    }
};

// Limite definido
const LIMITE = 75;
const UPDATE_INTERVAL = 2000; // 2 segundos

// Inicializa os elementos dos timers
function initializeTimers() {
    const timeElements = document.querySelectorAll('.kpi-fim');
    resourceTimers.cpu.element = timeElements[0];
    resourceTimers.ram.element = timeElements[1];
    resourceTimers.disk.element = timeElements[2];
}

// Função para formatar o tempo (HH:MM:SS)
function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// Controla o timer para um recurso específico
function controlTimer(resource, currentValue) {
    const timer = resourceTimers[resource];
    
    if (currentValue > LIMITE) {
        if (!timer.isExceeded) {
            // Começa uma nova contagem independente
            timer.isExceeded = true;
            timer.currentTime = 0; // Zera apenas este contador
            timer.interval = setInterval(() => {
                timer.currentTime++;
                timer.element.textContent = `Tempo: ${formatTime(timer.currentTime)}`;
            }, 1000);
        }
    } else {
        if (timer.isExceeded) {
            // Para a contagem mas mantém o tempo exibido
            timer.isExceeded = false;
            clearInterval(timer.interval);
            timer.interval = null;
        }
    }
}

// Variáveis para gráficos
let chartCPU, chartRAM, chartDISK, chartREDE;
let historicoCPU = [];
let historicoRAMpercent = [];
let historicoRAMGB = [];
let historicoREDEenv = [];
let historicoREDErec = [];

async function carregarDados() {
    try {
        const response = await fetch('/dashMatheus/dadosRecebidos', {
            method: 'GET',
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const resultado = await response.json();
        const dados = resultado.dadosEnviados || resultado;
        console.log("Dados recebidos:", dados);

        if (!dados) {
            throw new Error("Dados não foram recebidos ou estão vazios.");
        }

        // Obtém os valores percentuais
        const cpu_percent = dados.cpu?.["Uso (%)"] ?? 0;
        const ram_percent = dados.ram?.["Uso (%)"] ?? 0;
        const disco_percent = dados.disk?.["Uso (%)"] ?? 0;

        // Atualiza KPIs
        document.querySelectorAll(".kpi-meio")[0].textContent = `${cpu_percent}%`;
        document.querySelectorAll(".kpi-meio")[1].textContent = `${ram_percent}%`;
        document.querySelectorAll(".kpi-meio")[2].textContent = `${disco_percent}%`;

        // Controla os timers para cada recurso
        controlTimer('cpu', cpu_percent);
        controlTimer('ram', ram_percent);
        controlTimer('disk', disco_percent);

        // Atualiza processos
        const listaProcessos = document.querySelector(".lista-processos");
        listaProcessos.innerHTML = '<div class="titulo-lista">Processos em Execução</div>';

        if (dados.top_processos?.length > 0) {
            dados.top_processos.forEach(proc => {
                const processo = document.createElement("div");
                processo.className = "processo";
                processo.innerHTML = `
                    <div class="info-processo">
                        <div class="nome-processo">${proc.name || "Processo desconhecido"}</div>
                        <div class="uso-cpu">${proc.cpu_percent || "CPU nao encontrada"} % </div>
                    </div>
                    <button class="botao-encerrar">Encerrar</button>
                `;
                listaProcessos.appendChild(processo);
            });
        } else {
            listaProcessos.innerHTML += '<div class="processo">Nenhum processo em execução</div>';
        }

        return dados;
    } catch (error) {
        console.error("Erro ao carregar dados:", error);
    }
}

async function carregarGraficos() {
    const dados = await carregarDados();
    if (!dados) return;

    // Função para adicionar valor mantendo máximo de 10 pontos
    function adicionarComLimite(historico, valor) {
        if (historico.length >= 10) {
            historico.shift();
        }
        historico.push(valor);
        return historico;
    }

    // Atualiza históricos
    adicionarComLimite(historicoCPU, dados.cpu?.["Uso (%)"] ?? 0);
    adicionarComLimite(historicoRAMpercent, dados.ram?.["Uso (%)"] ?? 0);
    adicionarComLimite(historicoRAMGB, dados.ram?.["Usado (GB)"] ?? 0);
    adicionarComLimite(historicoREDEenv, dados.network?.["Pacotes Enviados"] ?? 0);
    adicionarComLimite(historicoREDErec, dados.network?.["Pacotes Recebidos"] ?? 0);

    const discoUsado = dados.disk?.["Uso (%)"] ?? 0;
    const discoDisponivel = 100 - discoUsado;
    const categorias = Array.from({ length: historicoCPU.length }, (_, i) => i + 1);

    // CPU (linha)
    if (!chartCPU) {
        chartCPU = new ApexCharts(document.querySelector("#chartcpu"), {
            series: [{ name: "CPU (%)", data: historicoCPU }],
            chart: { type: "line", height: 300 },
            xaxis: { categories: categorias },
            yaxis: { min: 0, max: 100, title: { text: "Uso" } }
        });
        chartCPU.render();
    } else {
        chartCPU.updateSeries([{ data: historicoCPU }]);
        chartCPU.updateOptions({ xaxis: { categories: categorias } });
    }

    // RAM (gráfico de linha com duas séries)
    if (!chartRAM) {
        chartRAM = new ApexCharts(document.querySelector("#chartram"), {
            series: [
                { name: "RAM (%)", data: historicoRAMpercent },
                { name: "RAM (GB)", data: historicoRAMGB }
            ],
            chart: { type: 'line', height: 300 },
            xaxis: { categories: categorias },
            yaxis: { title: { text: "Uso" }, min: 0 },
            tooltip: { shared: true, intersect: false },
            legend: { position: 'top' }
        });
        chartRAM.render();
    } else {
        chartRAM.updateSeries([{ data: historicoRAMpercent }, { data: historicoRAMGB }]);
        chartRAM.updateOptions({ xaxis: { categories: categorias } });
    }

    // DISCO (pizza)
    if (!chartDISK) {
        chartDISK = new ApexCharts(document.querySelector("#chartdisco"), {
            series: [discoUsado, discoDisponivel],
            chart: { type: "pie", height: 300 },
            labels: ["Uso (%)", "Disponível (%)"],
            colors: ["#FF4560", "#00E396"],
            legend: { position: "bottom" }
        });
        chartDISK.render();
    } else {
        chartDISK.updateSeries([discoUsado, discoDisponivel]);
    }

    // REDE (linha, dois dados)
    if (!chartREDE) {
        chartREDE = new ApexCharts(document.querySelector("#chartrede"), {
            series: [
                { name: "Pacotes Enviados", data: historicoREDEenv },
                { name: "Pacotes Recebidos", data: historicoREDErec }
            ],
            chart: { type: "line", height: 300 },
            xaxis: { categories: categorias },
            yaxis: { title: { text: "Pacotes" } },
            legend: { position: "bottom" }
        });
        chartREDE.render();
    } else {
        chartREDE.updateSeries([{ data: historicoREDEenv }, { data: historicoREDErec }]);
        chartREDE.updateOptions({ xaxis: { categories: categorias } });
    }
}

function carregarTudo() {
    carregarDados().then(() => {
        carregarGraficos();
    });
}

// Inicializa os timers quando a página carrega
document.addEventListener('DOMContentLoaded', () => {
    initializeTimers();
    carregarTudo();
    setInterval(carregarTudo, UPDATE_INTERVAL);
});