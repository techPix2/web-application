//chart status dos servidores
var chartPizzaOptions = {
  series: [0, 0, 0], // Normal, Atenção, Crítico
  chart: {
    width: 380,
    type: 'pie',
  },
  labels: ['Normal', 'Atenção', 'Crítico'],
  colors: ['#008000', '#ff9900', '#f50000'],
  responsive: [{
    breakpoint: 480,
    options: {
      chart: { width: 200 },
      legend: { position: 'bottom' }
    }
  }]
};

var chartPizza = new ApexCharts(document.querySelector("#chart"), chartPizzaOptions);
chartPizza.render();


document.addEventListener('DOMContentLoaded', function () {
  tabelaServidores = document.getElementById('tabelaServidores');
  compMaisAlertas = document.getElementById('compMaisAlertas');
  buscarServidoresComAlerta();
});

const intervalosAtualizacao = {};
async function buscarServidoresComAlerta() {
  try {
    const response = await fetch(`/machine/list`);

    if (!response.ok) {
      throw new Error(`Erro ao buscar máquinas: ${response.status}`);
    }

    const { machines } = await response.json();
    console.log("Máquinas ativas:", machines);

    // Atualiza a lista, removendo servidores que saíram
    // Vamos garantir que só tenha linhas para máquinas atuais
    const linhasExistentes = Array.from(tabelaServidores.querySelectorAll('tr[id^="linha-"]'))
        .map(tr => tr.id.replace("linha-", ""));

    // Remove linhas das máquinas que não estão mais na lista
    linhasExistentes.forEach(mobuIdExistente => {
      if (!machines.includes(mobuIdExistente)) {
        // Para o interval se existir
        if (intervalosAtualizacao[mobuIdExistente]) {
          clearInterval(intervalosAtualizacao[mobuIdExistente]);
          delete intervalosAtualizacao[mobuIdExistente];
        }
        // Remove linhas da tabela
        const linha = document.getElementById(`linha-${mobuIdExistente}`);
        const graficoRow = document.getElementById(`grafico-row-${mobuIdExistente}`);
        if (linha) linha.remove();
        if (graficoRow) graficoRow.remove();
      }
    });

    // Adiciona as novas máquinas que ainda não estão na tabela
    for (const mobuId of machines) {
      if (!document.getElementById(`linha-${mobuId}`)) {
        tabelaServidores.innerHTML += `
          <tr id="linha-${mobuId}">
            <td>${mobuId}</td>
            <td id="status-${mobuId}" style="color: green; font-weight: bold;">NORMAL</td>
            <td id="componente-${mobuId}">--</td>
            <td id="uso-${mobuId}" style="font-weight: bold;">--</td>
            <td>
              <button class="button-eye" data-id="${mobuId}">
                <i class="bi bi-eye"></i>
              </button>
            </td>
          </tr>
          <tr class="grafico-row" id="grafico-row-${mobuId}" style="display:none;">
            <td colspan="5">
              <div class="graficoServidor" id="graficoServidor-${mobuId}"></div>
            </td>
          </tr>
        `;

        // Remove intervalo antigo, se existir, para evitar múltiplos
        if (intervalosAtualizacao[mobuId]) {
          clearInterval(intervalosAtualizacao[mobuId]);
        }
        intervalosAtualizacao[mobuId] = setInterval(() => atualizarDadosRealtime(mobuId), 2000);
      }
    }

    // Atualiza eventos dos botões
    document.querySelectorAll('.button-eye').forEach(button => {
      // Remove event listener antigo, se existir
      if (button._clickHandler) {
        button.removeEventListener('click', button._clickHandler);
      }

      // Cria novo handler e associa ao botão
      button._clickHandler = function () {
        const servidorId = this.getAttribute('data-id');
        mostrarGraficoServidor(servidorId);     // Mostra/oculta o gráfico
        carregarGraficos(servidorId);           // Inicia o gráfico com os dados atuais
      };

      button.addEventListener('click', button._clickHandler);
    });


  } catch (error) {
    console.error("Erro ao buscar máquinas:", error);
    alert("Não foi possível carregar a lista de máquinas. Por favor, tente novamente mais tarde.");
  }
}

setInterval(() => {
  buscarServidoresComAlerta();
}, 10000); // Atua

async function atualizarDadosRealtime(mobuId) {
  try {
    const res = await fetch(`/realtime/${mobuId}`);
    if (!res.ok) return;

    const dados = await res.json();
    const ultima = dados.entries[dados.entries.length - 1];
    if (!ultima || !ultima.data) return;

    const { cpu, ram, disk } = ultima.data;

    const usoCpu = cpu?.["Uso (%)"] ?? 0;
    const usoRam = ram?.["Uso (%)"] ?? 0;
    const usoDisk = disk?.["Uso (%)"] ?? 0;

    const maior = [
      { componente: "CPU", uso: usoCpu },
      { componente: "RAM", uso: usoRam },
      { componente: "Disco", uso: usoDisk }
    ].reduce((a, b) => (a.uso > b.uso ? a : b));

    let statusText = "NORMAL";
    let statusColor = "green";

    if (maior.uso > 80) {
      statusText = "CRÍTICO";
      statusColor = "red";
    } else if (maior.uso >= 70) {
      statusText = "ATENÇÃO";
      statusColor = "orange";
    }

    const statusEl = document.getElementById(`status-${mobuId}`);
    const componenteEl = document.getElementById(`componente-${mobuId}`);
    const usoEl = document.getElementById(`uso-${mobuId}`);

    if (statusEl) {
      statusEl.textContent = statusText;
      statusEl.style.color = statusColor;
    }
    if (componenteEl) componenteEl.textContent = maior.componente;
    if (usoEl) {
      usoEl.textContent = `${maior.uso.toFixed(1)}%`;
      usoEl.style.color = statusColor;
    }

    ordenarTabelaPorStatus();
    atualizarComponenteMaisCritico();

  } catch (err) {
    console.warn(`Erro ao atualizar dados de ${mobuId}:`, err);
  }
}

function ordenarTabelaPorStatus() {
  const tabela = tabelaServidores;
  const linhas = Array.from(tabela.querySelectorAll('tr[id^="linha-"]'));

  const prioridade = { "CRÍTICO": 1, "ATENÇÃO": 2, "NORMAL": 3 };

  linhas.sort((a, b) => {
    const statusA = a.querySelector('td[id^="status-"]')?.textContent || "NORMAL";
    const statusB = b.querySelector('td[id^="status-"]')?.textContent || "NORMAL";

    return prioridade[statusA] - prioridade[statusB];
  });

  linhas.forEach(linha => {
    tabela.appendChild(linha);
    const mobuId = linha.id.replace("linha-", "");
    const graficoRow = document.getElementById(`grafico-row-${mobuId}`);
    if (graficoRow) tabela.appendChild(graficoRow);
  });
}

function atualizarComponenteMaisCritico() {
  const linhas = Array.from(tabelaServidores.querySelectorAll('tr[id^="linha-"]'));

  // Contadores por componente para status CRÍTICO
  const contagem = { CPU: 0, RAM: 0, Disco: 0 };

  linhas.forEach(linha => {
    const status = linha.querySelector('td[id^="status-"]')?.textContent || "";
    const componente = linha.querySelector('td[id^="componente-"]')?.textContent || "";
    if (status === "CRÍTICO" && componente in contagem) {
      contagem[componente]++;
    }
  });

  // Encontra o(s) componente(s) com maior quantidade
  const maxValor = Math.max(...Object.values(contagem));

  if (maxValor === 0) {
    compMaisAlertas.textContent = "Nenhum";
    return;
  }

  const componentesComMax = Object.entries(contagem)
      .filter(([_, val]) => val === maxValor)
      .map(([comp]) => comp);

  compMaisAlertas.textContent = componentesComMax.join(" | ");
  atualizarGraficoStatusServidores();
  console.log("depois do grafico")

}

function atualizarGraficoStatusServidores() {
  console.log("entrei na atualização");

  const tabelaServidores = document.getElementById('tabelaServidores');
  if (!tabelaServidores) {
    console.warn('Tabela de servidores não encontrada');
    return;
  }

  const linhas = Array.from(tabelaServidores.querySelectorAll('tr[id^="linha-"]'));
  console.log("linhas", linhas);

  let contagem = { 'NORMAL': 0, 'ATENÇÃO': 0, 'CRÍTICO': 0 };

  linhas.forEach(linha => {
    const tdStatus = linha.querySelector('td[id^="status-"]');
    if (!tdStatus) return;

    const status = tdStatus.textContent.toUpperCase().trim();
    if (contagem.hasOwnProperty(status)) {
      contagem[status]++;
    }
    console.log(contagem);
  });

  if (typeof chartPizza !== 'undefined' && chartPizza.updateSeries) {
    chartPizza.updateSeries([
      contagem['NORMAL'],
      contagem['ATENÇÃO'],
      contagem['CRÍTICO']
    ]);
  } else {
    console.warn('Objeto chartPizza não encontrado ou não inicializado');
  }
}




const graficosIntervalos = new Map(); // Armazena intervals por máquina
const graficosRenderizados = new Map(); // Armazena gráficos por máquina

function mostrarGraficoServidor(mobuId) {
  const graficoContainer = document.getElementById(`graficoServidor-${mobuId}`);
  const graficoRow = document.getElementById(`grafico-row-${mobuId}`);

  if (!graficoContainer || !graficoRow) {
    console.warn(`Elemento de gráfico não encontrado para ${mobuId}`);
    return;
  }

  // Alternar visibilidade da linha de gráfico
  const estaVisivel = graficoRow.style.display === "table-row";
  document.querySelectorAll('.grafico-row').forEach(row => row.style.display = "none");
  if (estaVisivel) return;
  graficoRow.style.display = "table-row";

  // Limpa intervalo anterior se existir
  if (graficosIntervalos.has(mobuId)) {
    clearInterval(graficosIntervalos.get(mobuId));
  }

  // Histórico local de dados
  const historicoCPU = [];
  const historicoRAM = [];
  const historicoDISK = [];

  // Criação inicial do gráfico se não renderizado antes
  if (!graficosRenderizados.has(mobuId)) {
    const maquinaOptions = {
      series: [
        { name: "CPU (%)", data: historicoCPU },
        { name: "RAM (%)", data: historicoRAM },
        { name: "DISCO (%)", data: historicoDISK }
      ],
      chart: {
        type: "line",
        height: 300
      },
      yaxis: {
        min: 0,
        max: 100,
        title: { text: "Uso (%)" }
      },
      xaxis: {
        labels: { show: false }
      },
      colors: ["#FF5733", "#33A1FF", "#28a745"]
    };

    const chart = new ApexCharts(graficoContainer, maquinaOptions);
    chart.render();
    graficosRenderizados.set(mobuId, chart);
  }

  const chart = graficosRenderizados.get(mobuId);

  // Atualiza gráfico com dados da API
  async function atualizarGrafico() {
    try {
      const res = await fetch(`/realtime/${mobuId}`);
      if (!res.ok) return;

      const dados = await res.json();
      const ultima = dados.entries[dados.entries.length - 1];
      if (!ultima || !ultima.data) return;

      const usoCpu = ultima.data.cpu?.["Uso (%)"] ?? 0;
      const usoRam = ultima.data.ram?.["Uso (%)"] ?? 0;
      const usoDisk = ultima.data.disk?.["Uso (%)"] ?? 0;

      if (historicoCPU.length >= 10) historicoCPU.shift();
      if (historicoRAM.length >= 10) historicoRAM.shift();
      if (historicoDISK.length >= 10) historicoDISK.shift();

      historicoCPU.push(usoCpu);
      historicoRAM.push(usoRam);
      historicoDISK.push(usoDisk);

      chart.updateSeries([
        { name: "CPU (%)", data: [...historicoCPU] },
        { name: "RAM (%)", data: [...historicoRAM] },
        { name: "DISCO (%)", data: [...historicoDISK] }
      ]);

    } catch (err) {
      console.warn(`Erro ao atualizar gráfico de ${mobuId}:`, err);
    }
  }

  // Chamada imediata e agendamento do intervalo
  atualizarGrafico();
  const intervalId = setInterval(atualizarGrafico, 2000);
  graficosIntervalos.set(mobuId, intervalId);
}


async function buscarChamadosUltimoDia() {
  console.log("Buscando dados do Jira...");
  try {
    //buscando dados dos chamados abertos do ULTIMO DIA do jira
    resposta = await fetch("/apiJira/jira-kpis?filtro=dia");
    const dados = await resposta.json();
    console.log("Dados do Jira recebidos:", dados);
    if (!resposta.ok) {
      throw new Error(`Erro ao buscar dados do Jira: ${resposta.status}`);
    }

    //atualizar os valores no HTML
    document.getElementById('ChamadosUltimoDia').innerHTML = dados.totalChamados;



  } catch (error) {
    console.error("Erro ao buscar dados do Jira:", error);
    return [];
  }
}

async function buscarChamadosStatus() {
  console.log("Buscando dados do Jira...");
  try {
    //buscando dados do TOTAL dos chamados ABERTOS do jira
    resposta = await fetch("/apiJira/jira-kpis?filtro=status");
    const dados = await resposta.json();
    console.log("Dados do Jira recebidos:", dados);
    if (!resposta.ok) {
      throw new Error(`Erro ao buscar dados do Jira: ${resposta.status}`);
    }

    //atualizar os valores no HTML
    document.getElementById('chamadosStatus').innerHTML = dados.totalChamados;


  } catch (error) {
    console.error("Erro ao buscar dados do Jira:", error);
    return [];
  }
}



async function fetchMessages() {
  try {
    const response = await fetch('/apiSlack/mensagens');

    if (!response.ok) {
      throw new Error(`Erro HTTP! status: ${response.status}`);
    }

    const messages = await response.json();
    const mensagensContainer = document.getElementById('mensagensContainer');
    mensagensContainer.innerHTML = '';
    console.log("Mensagens recebidas:", messages);
    messages.forEach((message) => {

      //formata a data e hora
      const data = new Date(parseFloat(message.ts) * 1000).toLocaleString();
      const user = message.user || 'Bot';
      const text = message.text || '';
      mensagensContainer.innerHTML += `
        <div class="mensagem">
          <div class="mensagem-cabecalho">
            <span class="mensagem-usuario">${user}</span>
            <span class="mensagem-data">${data}</span>
          </div>
          <div class="mensagem-texto">${text}</div>
        </div>
      `;
    });
  } catch (error) {
    console.error("Erro ao buscar mensagens:", error);

    const mensagensContainer = document.getElementById('mensagensContainer');
    mensagensContainer.innerHTML = '<div class="error">Erro ao carregar mensagens. Tente novamente.</div>';
  }
}

async function enviar() {
  const messageInput = document.getElementById('messageInput');
  const messageText = messageInput.value;
  if (messageText) {
    try {

      //envia a mensagem
      const response = await fetch('/apiSlack/enviarMensagem', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: messageText }),
      });

      if (!response.ok) {
        throw new Error(`Erro HTTP! status: ${response.status}`);
      }

      const result = await response.json();
      if (result.ok) {
        console.log(`Mensagem enviada com sucesso: ${result.ts}`);
        messageInput.value = ''; //limpa o campo do input
        fetchMessages(); //atualiza a lista de mensagens
      } else {
        console.error("Erro ao enviar mensagem:", result.error);
      }
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
    }
  }
}


const historicoCPU = {};
const historicoRAM = {};
const historicoDISK = {};
const charts = {};
let intervaloAtual = null;
let graficoAtual = null;

async function carregarGraficos(mobuId) {
  try {
    // Oculta todos os gráficos
    document.querySelectorAll(".grafico-row").forEach(row => {
      row.style.display = "none";
    });

    // Mostra o gráfico da máquina clicada
    const linhaGrafico = document.getElementById(`grafico-row-${mobuId}`);
    if (linhaGrafico) {
      linhaGrafico.style.display = "table-row";
    }

    // Cancela intervalo anterior
    if (intervaloAtual) {
      clearInterval(intervaloAtual);
    }

    async function atualizarGrafico() {
      try {
        const res = await fetch(`/realtime/${mobuId}`);
        if (!res.ok) return;

        const dados = await res.json();
        const ultima = dados.entries[dados.entries.length - 1];
        if (!ultima || !ultima.data) return;

        const cpuUsage = ultima.data.cpu?.["Uso (%)"] ?? 0;
        const ramUsage = ultima.data.ram?.["Uso (%)"] ?? 0;
        const diskUsage = ultima.data.disk?.["Uso (%)"] ?? 0;

        if (!historicoCPU[mobuId]) historicoCPU[mobuId] = [];
        if (!historicoRAM[mobuId]) historicoRAM[mobuId] = [];
        if (!historicoDISK[mobuId]) historicoDISK[mobuId] = [];

        function adicionarComLimite(historico, valor) {
          if (historico.length >= 10) historico.shift();
          historico.push(valor);
        }

        adicionarComLimite(historicoCPU[mobuId], cpuUsage);
        adicionarComLimite(historicoRAM[mobuId], ramUsage);
        adicionarComLimite(historicoDISK[mobuId], diskUsage);

        if (!charts[mobuId]) {
          charts[mobuId] = new ApexCharts(document.querySelector(`#graficoServidor-${mobuId}`), {
            series: [
              { name: "CPU (%)", data: historicoCPU[mobuId] },
              { name: "RAM (%)", data: historicoRAM[mobuId] },
              { name: "DISK (%)", data: historicoDISK[mobuId] }
            ],
            chart: { type: "line", height: 300 },
            yaxis: { min: 0, max: 100, title: { text: "Uso (%)" } },
            xaxis: { labels: { show: false } },
            colors: ["#FF5733", "#33A1FF", "#28a745"]
          });
          charts[mobuId].render();
        } else {
          charts[mobuId].updateSeries([
            { name: "CPU (%)", data: historicoCPU[mobuId] },
            { name: "RAM (%)", data: historicoRAM[mobuId] },
            { name: "DISK (%)", data: historicoDISK[mobuId] }
          ]);
        }

      } catch (err) {
        console.error(`Erro ao atualizar gráfico de ${mobuId}:`, err);
      }
    }

    await atualizarGrafico(); // atualiza imediatamente
    intervaloAtual = setInterval(atualizarGrafico, 2000);
    graficoAtual = mobuId;

  } catch (err) {
    console.error(`Erro ao carregar gráfico do servidor ${mobuId}:`, err);
  }
}


document.addEventListener('DOMContentLoaded', () => {
  buscarServidoresComAlerta();
  buscarChamadosStatus();
  buscarChamadosUltimoDia();
  fetchMessages();
});


