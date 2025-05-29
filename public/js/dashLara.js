// //mostrar e esconder os gráficos
// document.querySelectorAll('.button-eye').forEach(button => {
//     button.addEventListener('click', () => {
//         const chartId = button.getAttribute('data-target');
//         const chartDiv = document.getElementById(chartId);
//         chartDiv.style.display = chartDiv.style.display === 'none' ? 'block' : 'none';
//     });
// });




//chart status dos servidores
var options = {
    series: [55, 13],
    chart: {
        width: 380,
        type: 'pie',
    },
    labels: ['Normal', 'Crítico'],
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

