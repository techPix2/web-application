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

//variáveis globais
let tabelaServidores;
let compMaisAlertas;

//inicializa e armazena os dados da tabela e kpis
document.addEventListener('DOMContentLoaded', function () {
  tabelaServidores = document.getElementById('tabelaServidores');
  compMaisAlertas = document.getElementById('compMaisAlertas');
  buscarServidoresComAlerta();
});

//função para buscar os servidores com alerta
async function buscarServidoresComAlerta() {
  let listaAlertas = [];

  try {
    //busca o id da empresa ou usa 1 como padrão
    const fk_company = sessionStorage.ID_EMPRESA || 1;
    const response = await fetch(`/servidores/listarServidoresComAlerta/${fk_company}`);

    if (!response.ok) {
      throw new Error(`Erro ao buscar servidores: ${response.status}`);
    }

    //requisição para pegar os dados dos servidores com alerta
    const alertas = await response.json();
    console.log(alertas);

    //contador
    let jsonAlertas = [{
      CPU: 0,
      RAM: 0
    }]

    tabelaServidores.innerHTML = ""; //limpar tabela


    //inicializa o contador 
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


    //mostra os dados na tabela
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
            <button class="dabaixo-grafico" id=dbaixo-grafico-${alerta.id}">Visualização detalhada</button>
        </td>
      </tr>
    `;
    }


    //função do olho para mostrar o gráfico 
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

  //fecha o gráfico de antes
  if (servidorGraficoAberto && servidorGraficoAberto !== idServer) {
    document.getElementById(`grafico-row-${servidorGraficoAberto}`).style.display = 'none';
    document.getElementById(`graficoServidor-${servidorGraficoAberto}`).innerHTML = '';
  }

  const graficoRow = document.getElementById(`grafico-row-${idServer}`);
  const chartContainer = document.getElementById(`graficoServidor-${idServer}`);

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


//atualizar as kpis do jira  

//mostrar os chamados do último dia
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

//mostrar os chamados que estão em abertos
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



// slack
async function fetchMessages() {
  try {
    //busca as mensagens
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

//executando as funções 
document.addEventListener('DOMContentLoaded', () => {
  buscarServidoresComAlerta();
  buscarChamadosStatus();
  buscarChamadosUltimoDia();
  fetchMessages();
});

