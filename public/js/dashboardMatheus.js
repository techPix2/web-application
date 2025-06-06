const resourceTimers = {
    cpu: { currentTime: 0, isExceeded: false, interval: null, element: null },
    ram: { currentTime: 0, isExceeded: false, interval: null, element: null },
    disk: { currentTime: 0, isExceeded: false, interval: null, element: null }
};

const LIMITE = 80;
const UPDATE_INTERVAL = 2000; // 2 segundos

function initializeTimers() {
    const timeElements = document.querySelectorAll('.kpi-fim');
    if (timeElements.length < 3) {
        console.error("Não foram encontrados elementos suficientes com a classe 'kpi-fim'");
    }
    resourceTimers.cpu.element = timeElements[0];
    resourceTimers.ram.element = timeElements[1];
    resourceTimers.disk.element = timeElements[2];
}

function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function controlTimer(resource, currentValue) {
    const timer = resourceTimers[resource];
    if (currentValue > LIMITE) {
        if (!timer.isExceeded) {
            timer.isExceeded = true;
            timer.currentTime = 0;
            timer.interval = setInterval(() => {
                timer.currentTime++;
                timer.element.textContent = `Tempo: ${formatTime(timer.currentTime)}`;
            }, 1000);
        }
    } else {
        if (timer.isExceeded) {
            timer.isExceeded = false;
            clearInterval(timer.interval);
            timer.interval = null;
        }
    }
}

function capturarMaquina(){
    const params = new URLSearchParams(window.location.search);
    const maquina = params.get('maquina');
    return maquina
}

async function carregarDados() {
    const maquina = capturarMaquina();
    console.log("Máquina:", maquina);

    document.getElementById("nomeMaquinaMonitorada").innerText = maquina;

    try {
        const response = await fetch(`/realtime/${maquina}`, { method: 'GET' });
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const resultado = await response.json();
        console.log("Resultado completo:", resultado);

        const ultimaEntrada = resultado.entries?.at(-1); // pega o último registro
        const dados = ultimaEntrada?.data;

        if (!dados) throw new Error("Dados não foram recebidos ou estão vazios.");

        console.log("Dados recebidos:", dados);

        document.querySelectorAll(".kpi-meio")[0].textContent = `${dados.cpu?.["Uso (%)"] ?? 0}%`;
        document.querySelectorAll(".kpi-meio")[1].textContent = `${dados.ram?.["Uso (%)"] ?? 0}%`;
        document.querySelectorAll(".kpi-meio")[2].textContent = `${dados.disk?.["Uso (%)"] ?? 0}%`;

        const listaProcessos = document.querySelector(".lista-processos");
        listaProcessos.innerHTML = '<div class="titulo-lista">Processos em Execução</div>';

        if (dados.top_processos?.length > 0) {
            dados.top_processos.forEach(proc => {
                const processo = document.createElement("div");
                processo.className = "processo";
                processo.innerHTML = `
                    <div class="info-processo">
                        <div class="nome-processo">${proc.name || "Processo desconhecido"}</div>
                        <div class="uso-cpu">${proc.cpu_percent ?? "N/A"}%</div>
                    </div>
                    <button class="botao-encerrar">Encerrar</button>
                `;
                listaProcessos.appendChild(processo);

                processo.querySelector(".botao-encerrar").addEventListener("click", () => {
                    const nomeProcesso = proc.name;
                    const pid = proc.pid || 0;
                    const cpuPercent = proc.cpu_percent || 0;

                    enfileirarComandoEncerrar(nomeProcesso, pid, cpuPercent);
                });
            });
        } else {
            listaProcessos.innerHTML += '<div class="processo">Nenhum processo em execução</div>';
        }

        controlTimer('cpu', dados.cpu?.["Uso (%)"] ?? 0);
        controlTimer('ram', dados.ram?.["Uso (%)"] ?? 0);
        controlTimer('disk', dados.disk?.["Uso (%)"] ?? 0);

        return dados;
    } catch (error) {
        console.error("Erro ao carregar dados:", error);
    }
}

async function enfileirarComandoEncerrar(nomeProcesso, pid, cpuPercent) {
    const mobuId = capturarMaquina();

    const payload = {
        machineId: mobuId,
        comando: {
            acao: "encerrar_processo",
            pid: pid,
            nome: nomeProcesso,
            cpu_percent: cpuPercent
        }
    };

    try {
        const response = await fetch('http://localhost:80/process/excluir', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorBody = await response.json().catch(() => null);
            const errorMessage = errorBody?.messages?.join('; ') || `Erro HTTP: ${response.status}`;
            throw new Error(errorMessage);
        }

        const resultado = await response.json();
        console.log("Comando enfileirado com sucesso:", resultado);
        alert(`Comando para encerrar '${nomeProcesso}' foi enfileirado com sucesso!`);

    } catch (error) {
        console.error("Erro ao enfileirar comando:", error);
        alert(`Erro ao enfileirar comando para '${nomeProcesso}':\n${error.message}`);
    }
}

let chartCPU, chartRAM, chartDISK, chartREDE;
let historicoCPU = [];
let historicoRAMpercent = [];
let historicoRAMGB = [];
let historicoREDEenv = [];
let historicoREDErec = [];

async function carregarGraficos() {
    const dados = await carregarDados();
    if (!dados) return;

    function adicionarComLimite(historico, valor) {
        if (historico.length >= 10) historico.shift();
        historico.push(valor);
        return historico;
    }

    adicionarComLimite(historicoCPU, dados.cpu?.["Uso (%)"] ?? 0);
    adicionarComLimite(historicoRAMpercent, dados.ram?.["Uso (%)"] ?? 0);
    adicionarComLimite(historicoREDEenv, dados.network?.["Pacotes Enviados"] ?? 0);
    adicionarComLimite(historicoREDErec, dados.network?.["Pacotes Recebidos"] ?? 0);

    const discoUsado = dados.disk?.["Uso (%)"] ?? 0;
    const discoDisponivel = 100 - discoUsado;
    const categorias = Array.from({ length: historicoCPU.length }, (_, i) => i + 1);

    if (!chartCPU) {
        chartCPU = new ApexCharts(document.querySelector("#chartcpu"), {
            series: [{ name: "CPU (%)", data: historicoCPU }],
            chart: { type: "line", height: 300 },
            annotations: { yaxis: [{ y: 80, borderColor: 'red', label: { text: 'Limite' } }] },
            xaxis: { categorias },
            yaxis: { max: 100, title: { text: "Uso" } }
        });
        chartCPU.render();
    } else {
        chartCPU.updateSeries([{ data: historicoCPU }]);
        chartCPU.updateOptions({ xaxis: { categorias } });
    }

    if (!chartRAM) {
        chartRAM = new ApexCharts(document.querySelector("#chartram"), {
            series: [
                { name: "RAM (%)", data: historicoRAMpercent },
            ],
            annotations: { yaxis: [{ y: 80, borderColor: 'red', label: { text: 'Limite' } }] },
            chart: { type: 'line', height: 300, animations: { enabled: false } },
            xaxis: { categorias },
            yaxis: { title: { text: "Uso" }, max: 100},
            tooltip: { shared: true, intersect: false },
            legend: { position: 'top' }
        });
        chartRAM.render();
    } else {
        chartRAM.updateSeries([
            { data: historicoRAMpercent },
            { data: historicoRAMGB }
        ]);
        chartRAM.updateOptions({ xaxis: { categorias } });
    }

    if (!chartDISK) {
        chartDISK = new ApexCharts(document.querySelector("#chartdisco"), {
            series: [discoUsado, discoDisponivel],
            chart: {
                type: "pie",
                height: 300
            },
            labels: ["Uso (%)", "Disponível (%)"],
            colors: ["#FF4560", "#00E396"],
            legend: {
                position: "bottom"
            },
            dataLabels: {
                enabled: true,
                style: {
                    fontSize: '18px', // Aumente ou ajuste conforme necessário
                    fontWeight: 'bold'
                }
            }
        });
        chartDISK.render();
    } else {
        chartDISK.updateSeries([discoUsado, discoDisponivel]);
    }


    if (!chartREDE) {
        chartREDE = new ApexCharts(document.querySelector("#chartrede"), {
            series: [
                { name: "Pacotes Enviados", data: historicoREDEenv },
                { name: "Pacotes Recebidos", data: historicoREDErec }
            ],
            chart: { type: "line", height: 300 },
            xaxis: { categorias },
            yaxis: { title: { text: "Pacotes" } },
            legend: { position: "bottom" }
        });
        chartREDE.render();
    } else {
        chartREDE.updateSeries([
            { data: historicoREDEenv },
            { data: historicoREDErec }
        ]);
        chartREDE.updateOptions({ xaxis: { categorias } });
    }
}

function carregarTudo() {
    carregarDados().then(() => {
    carregarGraficos();
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initializeTimers();
    carregarTudo();
    setInterval(carregarTudo, UPDATE_INTERVAL);
});