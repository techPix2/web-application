//chart status dos servidores
var options = {
  series: [55, 13],
  chart: {
    width: 380,
    type: 'pie',
  },
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
    }
  }]
};

var chart = new ApexCharts(document.querySelector("#chart"), options);
chart.render();


let tabelaServidores;
let compMaisAlertas;
let historicoCPU = []
let historicoRAMpercent = []
let chartCPU

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
      button.removeEventListener('click', button._clickHandler);
      button._clickHandler = function () {
        const servidorId = this.getAttribute('data-id');
        mostrarGraficoServidor(servidorId);
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
}




let servidorGraficoAberto = null;

function mostrarGraficoServidor(idServer) {

  //fecha o gráfico de antes
  if (servidorGraficoAberto && servidorGraficoAberto !== idServer) {
    document.getElementById(`grafico-row-${servidorGraficoAberto}`).style.display = 'none';
    document.getElementById(`graficoServidor-${servidorGraficoAberto}`).innerHTML = '';

  }

  const graficoRow = document.getElementById(`grafico-row-${idServer}`);
  const chartContainer = document.getElementById(`graficoServidor-${idServer}`);
  const tableServidor = document.getElementById("table_servidores")
  //se estiver aberto para este servidor ele fecha
  if (servidorGraficoAberto === idServer) {
    graficoRow.style.display = 'none';
    chartContainer.innerHTML = '';
    servidorGraficoAberto = null;
    return;
  }

  servidorGraficoAberto = idServer;
  graficoRow.style.display = '';

  //busca os dados do servidor
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










async function carregarDados() {
  try {
    const response = await fetch('/dashMatheus/dadosRecebidos', {
      method: 'GET',
    });
    const resultado = await response.json();
    const dados = resultado.dadosEnviados
    console.log(dados)
    return dados;
  } catch (error) {
    console.error("Erro ao carregar dados:", error);
  }

}

async function carregarGraficos() {
  const dados = await carregarDados();

  function adicionarComLimite(historico, valor) {
    if (historico.length >= 10) {
      historico.shift();
    }
    historico.push(valor);
  }

  const cpuUsage = dados && dados.cpu && typeof dados.cpu["Uso (%)"] !== 'undefined' ? dados.cpu["Uso (%)"] : 0;
  const ramUsage = dados && dados.ram && typeof dados.ram["Uso (%)"] !== 'undefined' ? dados.ram["Uso (%)"] : 0;

  adicionarComLimite(historicoCPU, cpuUsage);
  adicionarComLimite(historicoRAMpercent, ramUsage);


  if (!chartCPU) {
    chartCPU = new ApexCharts(document.querySelector("#grafico-row-3"), {
      series: [{ name: "CPU (%)", data: historicoCPU },{ name: "RAM (%)", data: historicoRAMpercent }],
      chart: { type: "line", height: 300 },
      yaxis: { min: 0, max: 100, title: { text: "Uso" } }
    });
    chartCPU.render();
  } else {
    chartCPU.updateSeries([{ name: "CPU (%)", data: historicoCPU },{ name: "RAM (%)", data: historicoRAMpercent }]);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  buscarServidoresComAlerta();
  buscarChamadosStatus();
  buscarChamadosUltimoDia();
  fetchMessages();
  setInterval(carregarGraficos, 2000)
});

