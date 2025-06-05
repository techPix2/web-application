//chart status dos servidores
var chartPizzaOptions = {
  series: [0, 0, 0], // normal, atenção e crítico
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


function vizualizacaoDetalhada(mobuId){
  window.location.href = `dashboardMatheus.html?maquina=${mobuId}`;
}


// armazena o setInterval
const intervalosAtualizacao = {};

async function buscarServidoresComAlerta() {
  try {

    // requisição get para listar as máquinas
    const response = await fetch(`/machine/list`);

    if (!response.ok) {
      throw new Error(`Erro ao buscar máquinas: ${response.status}`);
    }

    // mostra as máquinas do  json no console
    const { machines } = await response.json();
    console.log("Máquinas ativas:", machines);

    // remove os servidores fora da lista
    const linhasExistentes = Array.from(tabelaServidores.querySelectorAll('tr[id^="linha-"]'))
        .map(tr => tr.id.replace("linha-", ""));

    linhasExistentes.forEach(mobuIdExistente => {
      if (!machines.includes(mobuIdExistente)) {

        if (intervalosAtualizacao[mobuIdExistente]) {
          clearInterval(intervalosAtualizacao[mobuIdExistente]);
          delete intervalosAtualizacao[mobuIdExistente];
        }
        // remove tabela e o gráfico
        const linha = document.getElementById(`linha-${mobuIdExistente}`);
        const graficoRow = document.getElementById(`grafico-row-${mobuIdExistente}`);
        if (linha) linha.remove();
        // remove o gráfico
        if (graficoRow) graficoRow.remove();
      }
    });

    // adiciona outros servidores
    for (const mobuId of machines) {
      if (!document.getElementById(`linha-${mobuId}`)) {
        tabelaServidores.innerHTML +=
            //formataçãa da tabela
            `
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
        `; // vizualizacaoDetalhada --> botão para ir para dash do Nocelli

        // atualiza o setInterval pro servidor
        if (intervalosAtualizacao[mobuId]) {
          clearInterval(intervalosAtualizacao[mobuId]);
        }
        intervalosAtualizacao[mobuId] = setInterval(() => atualizarDadosRealtime(mobuId), 2000);
      }
    }

    // funcionamento botão olho
    document.querySelectorAll('.button-eye').forEach(button => {

      if (button._clickHandler) {
        button.removeEventListener('click', button._clickHandler);
      }

      // pega o evento de click do botão do olhinho
      button._clickHandler = function () {
        const servidorId = this.getAttribute('data-id');
        mostrarGraficoServidor(servidorId);     // mostra/fecha o gráfico
        carregarGraficos(servidorId);           // gráfico com dados atuais
      };

      button.addEventListener('click', button._clickHandler);
    });


  } catch (error) {
    console.error("Erro ao buscar máquinas:", error);
    alert("Não foi possível carregar a lista de máquinas. Por favor, tente novamente mais tarde.");
  }
}

// atualização
setInterval(() => {
  buscarServidoresComAlerta();
}, 10000);


async function atualizarDadosRealtime(mobuId) {
  try {

    // requisição dos dados
    const res = await fetch(`/realtime/${mobuId}`);
    if (!res.ok) return;


    // ultimo dado do uso
    const dados = await res.json();
    const ultima = dados.entries[dados.entries.length - 1];
    if (!ultima || !ultima.data) return;

    const { cpu, ram, disk } = ultima.data;

    // porcentagens do uso de cada
    const usoCpu = cpu?.["Uso (%)"] ?? 0;
    const usoRam = ram?.["Uso (%)"] ?? 0;
    const usoDisk = disk?.["Uso (%)"] ?? 0;


    // identifica o componente mais usado
    const maior = [
      { componente: "CPU", uso: usoCpu },
      { componente: "RAM", uso: usoRam },
      { componente: "Disco", uso: usoDisk }
    ].reduce((a, b) => (a.uso > b.uso ? a : b));


    // status do servidor
    let statusText = "NORMAL";
    let statusColor = "green";

    // muda as cores de acordo com o uso
    if (maior.uso > 80) {
      statusText = "CRÍTICO";
      statusColor = "red";
    } else if (maior.uso >= 70) {
      statusText = "ATENÇÃO";
      statusColor = "orange";
    }


    // criando uma const para cada elemento para atualizar o front da tabela
    const statusEl = document.getElementById(`status-${mobuId}`);
    const componenteEl = document.getElementById(`componente-${mobuId}`);
    const usoEl = document.getElementById(`uso-${mobuId}`);


    // html do servidor
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

  // tabela
  const tabela = tabelaServidores;

  // pega as linhas dos servidores
  const linhas = Array.from(tabela.querySelectorAll('tr[id^="linha-"]'));

  // status para definir a ordem
  const prioridade = { "CRÍTICO": 1, "ATENÇÃO": 2, "NORMAL": 3 };


  // ordena as linhas colocando em ordem de status
  linhas.sort((a, b) => {
    const statusA = a.querySelector('td[id^="status-"]')?.textContent || "NORMAL";
    const statusB = b.querySelector('td[id^="status-"]')?.textContent || "NORMAL";


    // ex:               1     -       2             = 1 pq vem antes
    return prioridade[statusA] - prioridade[statusB];
  });


  // devolve as linhas ordenadas
  linhas.forEach(linha => {
    tabela.appendChild(linha);
    const mobuId = linha.id.replace("linha-", "");
    const graficoRow = document.getElementById(`grafico-row-${mobuId}`);
    if (graficoRow) tabela.appendChild(graficoRow);
  });
}

function atualizarComponenteMaisCritico() {

  // linhas dos servidores
  const linhas = Array.from(tabelaServidores.querySelectorAll('tr[id^="linha-"]'));

  // contador pra kpi do compMaisAlertas
  const contagem = { CPU: 0, RAM: 0, Disco: 0 };

  // contagem dos críticos
  linhas.forEach(linha => {
    const status = linha.querySelector('td[id^="status-"]')?.textContent || "";
    const componente = linha.querySelector('td[id^="componente-"]')?.textContent || "";

    if (status === "CRÍTICO" && componente in contagem) {
      contagem[componente]++;
    }
  });

  // componente mais crítico
  // pega os valores da linha 247 e o Math.max retorna o maior número de acordo com a prioridade da setada na linha 218
  const maxValor = Math.max(...Object.values(contagem));


  // se não tiver nenhum crítico
  if (maxValor === 0) {
    compMaisAlertas.textContent = "Nenhum";
    return;
  }

  // mostra o compontente
  // transforma a contagem da linha 218 em um array de pares --> componente e valor
  const componentesComMax = Object.entries(contagem)

      // pega os valores igual ou maior o maxValor da linha 261
      .filter(([_, val]) => val === maxValor)

      //  nome do componente
      .map(([comp]) => comp);


  // mostra no html
  compMaisAlertas.textContent = componentesComMax.join(" | "); // se tiver empate mostra os dois

  // atualiza o gráfico
  atualizarGraficoStatusServidores();
  console.log("depois do grafico")

}

function atualizarGraficoStatusServidores() {
  console.log("entrei na atualização");

  // busca a tabela de servidores no html
  const tabelaServidores = document.getElementById('tabelaServidores');

  if (!tabelaServidores) {
    console.warn('Tabela de servidores não encontrada');
    return;
  }

  const linhas = Array.from(tabelaServidores.querySelectorAll('tr[id^="linha-"]'));
  console.log("linhas", linhas);

  let contagem = { 'NORMAL': 0, 'ATENÇÃO': 0, 'CRÍTICO': 0 };

  // conta a qtd de cada status
  linhas.forEach(linha => {
    const tdStatus = linha.querySelector('td[id^="status-"]');
    if (!tdStatus) return;

    // padroniza como está o texto do status tirando espaço extra e colocando tudo em  letra maiúscula
    const status = tdStatus.textContent.toUpperCase().trim();

    // pega o status da linha 312 e adiciona na contagem do linha 304
    if (contagem.hasOwnProperty(status)) {
      contagem[status]++;
    }
    console.log(contagem);
  });

  // atualiza o gráfico de status dos servidores
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

// guarda o intervalo de atualização
const graficosIntervalos = new Map();

// guarda os gráficos do momento
const graficosRenderizados = new Map();

function mostrarGraficoServidor(mobuId) {
  // div do gráfico
  const graficoContainer = document.getElementById(`graficoServidor-${mobuId}`);
  // linha do gráfico
  const graficoRow = document.getElementById(`grafico-row-${mobuId}`);

  if (!graficoContainer || !graficoRow) {
    console.warn(`Elemento de gráfico não encontrado para ${mobuId}`);
    return;
  }

  // se a linha já aparece
  const estaVisivel = graficoRow.style.display === "table-row";

  //  esconde as linhas para aparecer o gráfico
  document.querySelectorAll('.grafico-row').forEach(row => row.style.display = "none");
  if (estaVisivel) return;

  // se não estiver aparecendo ele mostra
  graficoRow.style.display = "table-row";

  // verifica o intervalo da linha 334
  if (graficosIntervalos.has(mobuId)) {
    // se tiver cancela o invervalo para não ter conflito
    clearInterval(graficosIntervalos.get(mobuId));
  }

  //  armazena os dados para o gráfico
  const historicoCPU = [];
  const historicoRAM = [];
  const historicoDISK = [];

  // criação do gráfico
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

  // repetidamente busca os dados com a API
  async function atualizarGrafico() {
    try {

      // retorna os dados do servidor
      const res = await fetch(`/realtime/${mobuId}`);
      if (!res.ok) return;

      const dados = await res.json();

      // pega o último dado registrado
      const ultima = dados.entries[dados.entries.length - 1];
      if (!ultima || !ultima.data) return;

      // extrai os valores
      const usoCpu = ultima.data.cpu?.["Uso (%)"] ?? 0;
      const usoRam = ultima.data.ram?.["Uso (%)"] ?? 0;
      const usoDisk = ultima.data.disk?.["Uso (%)"] ?? 0;

      // limita a 10 e o shift serve para remover os antigos
      if (historicoCPU.length >= 10) historicoCPU.shift();
      if (historicoRAM.length >= 10) historicoRAM.shift();
      if (historicoDISK.length >= 10) historicoDISK.shift();

      // coloca no historico da linha 367
      historicoCPU.push(usoCpu);
      historicoRAM.push(usoRam);
      historicoDISK.push(usoDisk);


      // atualiza o gráfico
      chart.updateSeries([
        { name: "CPU (%)", data: [...historicoCPU] },
        { name: "RAM (%)", data: [...historicoRAM] },
        { name: "DISCO (%)", data: [...historicoDISK] }
      ]);

    } catch (err) {
      console.warn(`Erro ao atualizar gráfico de ${mobuId}:`, err);
    }
  }


  atualizarGrafico();
  const intervalId = setInterval(atualizarGrafico, 2000);

  //  pega o intervalo da linha 334
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

    //atualizar os valores no HTML com base na linha 458
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

    //atualizar os valores no HTML com base na linha 480
    document.getElementById('chamadosStatus').innerHTML = dados.totalChamados;


  } catch (error) {
    console.error("Erro ao buscar dados do Jira:", error);
    return [];
  }
}

async function fetchMessages() {
  try {
    //busca as mensagens
    const response = await fetch('/apiSlack/mensagens');

    if (!response.ok) {
      throw new Error(`Erro HTTP! status: ${response.status}`);
    }


    const messages = await response.json();

    // limpa mensagem antiga quando clica no botão para enviar
    const mensagensContainer = document.getElementById('mensagensContainer');
    mensagensContainer.innerHTML = '';

    console.log("Mensagens recebidas:", messages);

    messages.forEach((message) => {

      //formata a data e hora
      const data = new Date(parseFloat(message.ts) * 1000).toLocaleString();
      const user = message.user || 'Bot';
      const text = message.text || '';

      // mensagem no chat
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

// armazena
const historicoCPU = {};
const historicoRAM = {};
const historicoDISK = {};
const charts = {};

// id do setInterval
let intervaloAtual = null;

// id do servidor
let graficoAtual = null;

async function carregarGraficos(mobuId) {
  try {
    // esconde as linnhas do gráfico para evitar sobreposição
    document.querySelectorAll(".grafico-row").forEach(row => {
      row.style.display = "none";
    });

    // mostra o gráfico
    const linhaGrafico = document.getElementById(`grafico-row-${mobuId}`);
    if (linhaGrafico) {
      linhaGrafico.style.display = "table-row";
    }

    // limpa o intervalo
    if (intervaloAtual) {
      clearInterval(intervaloAtual);
    }

    async function atualizarGrafico() {
      try {

        // busca dados pela API
        const res = await fetch(`/realtime/${mobuId}`);

        if (!res.ok) return;

        // pega os ultimos ddos
        const dados = await res.json();
        const ultima = dados.entries[dados.entries.length - 1];

        if (!ultima || !ultima.data) return;

        // extração dos valores e não tiver valor usa 0
        const cpuUsage = ultima.data.cpu?.["Uso (%)"] ?? 0;
        const ramUsage = ultima.data.ram?.["Uso (%)"] ?? 0;
        const diskUsage = ultima.data.disk?.["Uso (%)"] ?? 0;

        // array histórico
        if (!historicoCPU[mobuId]) historicoCPU[mobuId] = [];
        if (!historicoRAM[mobuId]) historicoRAM[mobuId] = [];
        if (!historicoDISK[mobuId]) historicoDISK[mobuId] = [];

        // limite para 10 e o shift sendo usado para apagar os mais antigos
        function adicionarComLimite(historico, valor) {
          if (historico.length >= 10) historico.shift();
          historico.push(valor);
        }

        adicionarComLimite(historicoCPU[mobuId], cpuUsage);
        adicionarComLimite(historicoRAM[mobuId], ramUsage);
        adicionarComLimite(historicoDISK[mobuId], diskUsage);



        // se o gráfico ainda não existir
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
        }

        // atuzaliza o gráfico
        else {
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
