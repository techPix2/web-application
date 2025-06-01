async function carregarDados() {
    try {
        const response = await fetch('/dashMatheus/dadosRecebidos', {
            method: 'GET',
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const resultado = await response.json();
        const dados = resultado.dadosEnviados || resultado; // Tenta "dadosEnviados", senão usa o objeto direto
        console.log("Dados recebidos:", dados);


        if (!dados) {
            throw new Error("Dados não foram recebidos ou estão vazios.");
        }

        // Atualiza KPIs (com fallback para 0 se não existir)
        document.querySelectorAll(".kpi-meio")[0].textContent = `${dados.cpu?.["Uso (%)"] ?? 0}%`;
        document.querySelectorAll(".kpi-meio")[1].textContent = `${dados.ram?.["Uso (%)"] ?? 0}%`;
        document.querySelectorAll(".kpi-meio")[2].textContent = `${dados.disk?.["Uso (%)"] ?? 0}%`;

        // Atualiza processos (só se existir)
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
        return dados; // Retorna os dados para uso posterior, se necessário
    } catch (error) {
        console.error("Erro ao carregar dados:", error);
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

  // Função para adicionar valor mantendo máximo de 10 pontos
  function adicionarComLimite(historico, valor) {
    if (historico.length >= 10) {
      historico.shift(); // Remove o mais antigo
    }
    historico.push(valor);
    return historico;
  }

  // Atualiza históricos com limite de 10 pontos
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
      yaxis: { min: 0, max: 100 , title: { text: "Uso" } }
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
        chart: { 
            type: 'line', 
            height: 300,
            animations: { enabled: false } // Desativa animações para simplificar
        },
        xaxis: { categories: categorias },
        yaxis: {
            title: { text: "Uso" },
            min: 0
        },
        tooltip: {
            shared: true,
            intersect: false
        },
        legend: {
            position: 'top'
        }
    });
    chartRAM.render();
} else {
    chartRAM.updateSeries([
        { data: historicoRAMpercent },
        { data: historicoRAMGB }
    ]);
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
    chartREDE.updateSeries([
      { data: historicoREDEenv },
      { data: historicoREDErec }
    ]);
    chartREDE.updateOptions({ xaxis: { categories: categorias } });
  }
}

function carregarTudo(){
    carregarDados();
    carregarGraficos();
}
// Loop de atualização a cada 2 segundos

document.querySelectorAll(".botao-encerrar").forEach(botao => { 
    botao.addEventListener("click", function() {
        const nomeProcesso = this.value;
        console.log("Tentando encerrar processo:", nomeProcesso);

        fetch('http://localhost:5000/dashMatheus/removerProcesso', { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ processo: nomeProcesso })
        })
        .then(response => {
            if (!response.ok) {
                return response.json().catch(() => null).then(errorBody => {
                    const errorMessage = errorBody && errorBody.messages ? errorBody.messages.join('; ') : `Erro HTTP: ${response.status} ${response.statusText}`;
                    throw new Error(errorMessage);
                });
            }
            return response.json();
        })
        .then(data => {
            console.log("Resposta do servidor:", data);
            let feedbackMessage = `Resultado para '${nomeProcesso}':\n`;
            if (data.messages && data.messages.length > 0) {
                feedbackMessage += data.messages.join('\n');
            } else {
                feedbackMessage += (data.success ? "Operação concluída com sucesso." : "Operação falhou sem mensagens detalhadas.");
            }
            alert(feedbackMessage);

            if (data.success) {
            }
        })
        .catch(error => {
            console.error('Erro ao tentar encerrar processo:', error);
            alert(`Falha na comunicação ou na operação de encerrar '${nomeProcesso}':\n${error.message}`);
        });
    });
});


setInterval(carregarTudo, 2000);


