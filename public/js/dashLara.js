//chart status dos servidores
<<<<<<< HEAD
var options = {
  series: [55, 13],
=======
var chartPizzaOptions = {
  series: [0, 0, 0], // Normal, Atenção, Crítico
>>>>>>> origin
  chart: {
    width: 380,
    type: 'pie',
  },
<<<<<<< HEAD
  labels: ['Normal', 'Crítico'],
  colors: ['#0078d7', '#f50000'],
  responsive: [{
    breakpoint: 480,
    options: {
      chart: {
        width: 200
      },
      legend: {
        position: 'bottom'
      }
=======
  labels: ['Normal', 'Atenção', 'Crítico'],
  colors: ['#008000', '#ff9900', '#f50000'],
  responsive: [{
    breakpoint: 480,
    options: {
      chart: { width: 200 },
      legend: { position: 'bottom' }
>>>>>>> origin
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

//variáveis globais
let tabelaServidores;
let compMaisAlertas;

//inicializa
document.addEventListener('DOMContentLoaded', function () {
  tabelaServidores = document.getElementById('tabelaServidores');
  compMaisAlertas = document.getElementById('compMaisAlertas');
  buscarServidoresComAlerta();
});

<<<<<<< HEAD


//função para buscar os servidores com alerta
async function buscarServidoresComAlerta() {
  let listaAlertas = [];

  try {
    const fk_company = sessionStorage.ID_EMPRESA || 1;
    const response = await fetch(`/servidores/listarServidoresComAlerta/${fk_company}`);

    if (!response.ok) {
      throw new Error(`Erro ao buscar servidores: ${response.status}`);
    }

    const alertas = await response.json();
    console.log(alertas);

    let jsonAlertas = [{
      CPU: 0,
      RAM: 0
    }]

    tabelaServidores.innerHTML = ""; //limpar tabela

    for (const alerta of alertas) {
      const servidor = {
        id: alerta.idServer,
        nome: alerta.hostName,
        status: alerta.status,
        uso: alerta.usage_percent,
        tipoAlerta: alerta.alert_type,
        horaAlerta: alerta.alert_time
      };

      //tipo de alerta e incrementa o contador para a KPI
      if (servidor.tipoAlerta === 'CPU') {
        jsonAlertas[0].CPU += 1;
      } else if (servidor.tipoAlerta === 'RAM') {
        jsonAlertas[0].RAM += 1;
      }

      //adiciona se NÃO existir um item com mesmo id e tipoAlerta
      if (!listaAlertas.some(item => item.id === servidor.id && item.tipoAlerta === servidor.tipoAlerta)) {
        listaAlertas.push(servidor);
      }

    }

    //atualiza a kpi
      if (jsonAlertas[0].CPU > jsonAlertas[0].RAM) {
        compMaisAlertas.innerHTML = `CPU`;
      } else if (jsonAlertas[0].RAM > jsonAlertas[0].CPU) {
        compMaisAlertas.innerHTML = `RAM`;
      } else {
        compMaisAlertas.innerHTML = `CPU | RAM`;
      }
 

      //mostra os dados
      for (const alerta of listaAlertas) {
        tabelaServidores.innerHTML += `
      <tr>
        <td>${alerta.nome}</td>
        <td style="color:red; font-weight:bold">CRÍTICO</td>
        <td>${alerta.tipoAlerta}</td>
        <td style="color:red; font-weight:bold">${alerta.uso}%</td>
        <td>
          <button class="button-eye" data-id="${alerta.id}">
            <i class="bi bi-eye"></i>
          </button>
        </td>
      </tr>
      <tr class="grafico-row" id="grafico-row-${alerta.id}" style="display:none;">
        <td colspan="5">
          <div class="graficoServidor" id="graficoServidor-${alerta.id}"></div>
        </td>
      </tr>
    `;
      }

      document.querySelectorAll('.button-eye').forEach(button => {
        button.addEventListener('click', function () {
          const servidorId = this.getAttribute('data-id');
          mostrarGraficoServidor(servidorId);
        });
      });
   
  }
  catch (error) {
    console.error("Erro ao buscar alertas:", error);
    alert("Não foi possível carregar os alertas. Por favor, tente novamente mais tarde.");
  }
}

//variável global para controlar o gráfico aberto
let servidorGraficoAberto = null;

function mostrarGraficoServidor(idServer) {
  //esconde o gráfico de antes se TIVER aberto

  if (servidorGraficoAberto && servidorGraficoAberto !== idServer) {
    document.getElementById(`grafico-row-${servidorGraficoAberto}`).style.display = 'none';
    document.getElementById(`graficoServidor-${servidorGraficoAberto}`).innerHTML = '';
  }

  const graficoRow = document.getElementById(`grafico-row-${idServer}`);
  const chartContainer = document.getElementById(`graficoServidor-${idServer}`);

  //se já estiver aberto para este servidor ele fecha
  if (servidorGraficoAberto === idServer) {
    graficoRow.style.display = 'none';
    chartContainer.innerHTML = '';
    servidorGraficoAberto = null;
    return;
  }

  servidorGraficoAberto = idServer;
  graficoRow.style.display = '';

  fetch(`/servidores/dados/${idServer}`)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Erro ao buscar dados do servidor: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      const options = {
        series: data.series,
        chart: {
          type: 'line',
          height: 350
        },
        xaxis: {
          categories: data.categories
        }
      };
      chartContainer.innerHTML = ""; //limpa o gráfico de antes

      //cria o gráfico com os dados
      const chart = new ApexCharts(chartContainer, options);
      chart.render();
    })
    .catch(error => {
      chartContainer.innerHTML = '<span style="color:red;">Erro ao carregar gráfico.</span>';
      console.error("Erro ao buscar dados do servidor:", error);
    });
}


//atualizar as kpis do jira  

//mostrar os chamados do último dia
async function buscarChamadosUltimoDia() {
  console.log("Buscando dados do Jira...");
=======
function vizualizacaoDetalhada(mobuId){
  window.location.href = `dashboardMatheus.html?maquina=${mobuId}`;
}

const intervalosAtualizacao = {};
async function buscarServidoresComAlerta() {
>>>>>>> origin
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
              <div style="margin-top: 10px; text-align: center;">
      <button onclick="vizualizacaoDetalhada('${mobuId}')" style="padding: 5px 10px; font-weight: bold;">
        Visualização Detalhada
      </button>
    </div>
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
}, 10000);

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
    atualizarGraficoStatusServidores()
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

const graficosIntervalos = new Map();
const graficosRenderizados = new Map();

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

<<<<<<< HEAD


// slack
=======
>>>>>>> origin
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
<<<<<<< HEAD
=======

      //formata a data e hora
>>>>>>> origin
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

<<<<<<< HEAD

=======
>>>>>>> origin
async function enviar() {
  const messageInput = document.getElementById('messageInput');
  const messageText = messageInput.value;
  if (messageText) {
    try {
<<<<<<< HEAD
=======

      //envia a mensagem
>>>>>>> origin
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
<<<<<<< HEAD
        messageInput.value = ''; // Limpa o campo de entrada
        fetchMessages(); // Atualiza a lista de mensagens
=======
        messageInput.value = ''; //limpa o campo do input
        fetchMessages(); //atualiza a lista de mensagens
>>>>>>> origin
      } else {
        console.error("Erro ao enviar mensagem:", result.error);
      }
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
    }
  }
}

<<<<<<< HEAD
=======
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

>>>>>>> origin
document.addEventListener('DOMContentLoaded', () => {
  buscarServidoresComAlerta();
  buscarChamadosStatus();
  buscarChamadosUltimoDia();
  fetchMessages();
<<<<<<< HEAD
});
=======
});


>>>>>>> origin
