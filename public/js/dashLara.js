//mostrar e esconder os gráficos
document.querySelectorAll('.button-eye').forEach(button => {
    button.addEventListener('click', () => {
        const chartId = button.getAttribute('data-target');
        const chartDiv = document.getElementById(chartId);
        chartDiv.style.display = chartDiv.style.display === 'none' ? 'block' : 'none';
    });
});

//gráfico de linha dos servidores
const lineChartOptions = {

    series: [
        {
            name: "CPU",
            data: [30, 40, 35, 50, 49, 60, 70, 91, 125]
        },
        {
            name: "MemóriaRAM",
            data: [20, 30, 25, 40, 45, 55, 60, 85, 100]
        }
    ],
    chart: {
        height: 350,
        type: 'line',
        zoom: { enabled: false }
    },
    dataLabels: { enabled: false },
    stroke: { curve: 'straight' },
    title: {
        text: 'Uso de Recursos dos Servidores',
        align: 'left'
    },
    grid: {
        row: {
            colors: ['#f3f3f3', 'transparent'],
            opacity: 0.5
        },
    },
    xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep']
    }
};

const lineChart = new ApexCharts(document.querySelector("#graficoServidor"), lineChartOptions);
lineChart.render();


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
        for (const alerta of alertas) {
            const servidor = {
                id: alerta.idServer,
                nome: alerta.hostName,
                status: alerta.status,
                uso: alerta.usage_percent,
                tipoAlerta: alerta.alert_type,
                horaAlerta: alerta.alert_time
            };

            if (
                listaAlertas.some(item => item.nome === servidor.nome) &&
                listaAlertas.some(item => item.tipoAlerta === servidor.tipoAlerta)
            ) {
            } else {
                listaAlertas.push(servidor);
            }
        }
        console.log(listaAlertas);
    } catch (error) {
        console.error("Erro ao buscar alertas:", error);

        alert("Não foi possível carregar os alertas. Por favor, tente novamente mais tarde.");
    }
}



// slack

// inicializar o bot

async function findConversation(name) {
  try {
    // Call the conversations.list method using the built-in WebClient
    const result = await app.client.conversations.list({
      // The token you used to initialize your app
      token: "xoxb-8588655585441-8938331177797-fKFQfCztpj5vP4N6teSy1LcP"
    });

    for (const channel of result.channels) {
      if (channel.name === name) {
        conversationId = channel.id;

        // Print result
        console.log("Found conversation ID: " + conversationId);
        // Break from for loop
        break;
      }
    }
  }
  catch (error) {
    console.error(error);
  }
}

// Find conversation with a specified channel `name`
findConversation("tester-channel");

