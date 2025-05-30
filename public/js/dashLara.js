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



// função para buscar os servidores com alerta
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

        for (const alerta of alertas) {
            const servidor = {
                id: alerta.idServer,
                nome: alerta.hostName,
                status: alerta.status,
                uso: alerta.usage_percent,
                tipoAlerta: alerta.alert_type,
                horaAlerta: alerta.alert_time
            };

            //tipo de alerta é CPU ou RAM e incrementa o contador para a KPI
            if (alerta.tipoAlerta === 'CPU') {
                jsonAlertas[0].CPU += 1;
            } else if (alerta.tipoAlerta === 'RAM') {
                jsonAlertas[0].RAM += 1;
            }
            
            // Só adiciona se NÃO existir já um item com mesmo id e tipoAlerta
            if (!listaAlertas.some(item => item.id === servidor.id && item.tipoAlerta === servidor.tipoAlerta)) {
                listaAlertas.push(servidor);
            }
            if (jsonAlertas[0].CPU > jsonAlertas[0].RAM) {
                compMaisAlertas.innerHTML = `CPU`;
            } else if (jsonAlertas[0].RAM > jsonAlertas[0].CPU) {
                compMaisAlertas.innerHTML = `RAM`;
            } else {
                compMaisAlertas.innerHTML = `CPU | RAM`;
            }

            tabelaServidores.innerHTML = "";
            for (const alerta of listaAlertas) {
                tabelaServidores.innerHTML += `
                <tr>
                    <td>${alerta.nome}</td>
                    <td style="color:red; font-weight:bold">CRÍTICO</td>
                    <td>${alerta.tipoAlerta}</td>l
                    <td style="color:red; font-weight:bold">${alerta.uso}%</td>
                    <td>
                        <button class="button-eye" data-id="${alerta.idServer}">
                            <i class="bi bi-eye"></i>
                        </button>
                    </td>
                </tr>
            `;
            }

            document.querySelectorAll('.button-eye').forEach(button => {
                button.addEventListener('click', function () {
                    const servidorId = this.getAttribute('data-id');
                    mostrarGraficoServidor(servidorId);
                    console.log(`Exibindo gráfico para o servidor com ID: ${servidorId}`);
                });
            });
            if (jsonAlertas[0].CPU > jsonAlertas[0].RAM) {

            }
        }
    } catch (error) {
        console.error("Erro ao buscar alertas:", error);

        alert("Não foi possível carregar os alertas. Por favor, tente novamente mais tarde.");
    }
}

//atualizar as kpis do jira  

//mostrar os chamados do último dia
async function buscarChamadosUltimoDia() {
    console.log("Buscando dados do Jira...");
  try {
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
    const response = await fetch('/apiSlack/mensagens');
    
    if (!response.ok) {
      throw new Error(`Erro HTTP! status: ${response.status}`);
    }
    
    const messages = await response.json();
    const mensagensContainer = document.getElementById('mensagensContainer');
    mensagensContainer.innerHTML = ''; 
    console.log("Mensagens recebidas:", messages);
    messages.forEach((message) => {
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
      const response = await fetch('/apiSlack/mensagens', { 
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
        messageInput.value = ''; // Limpa o campo de entrada
        fetchMessages(); // Atualiza a lista de mensagens
      } else {
        console.error("Erro ao enviar mensagem:", result.error);
      }
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
    }
  }
}
