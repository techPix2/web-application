const { json } = require("express");

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
           let jsonAlertas =[{
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
                if (alerta.tipoAlerta === 'CPU') {
                jsonAlertas[0].CPU += 1;
            } else if (alerta.tipoAlerta === 'RAM') {
                jsonAlertas[0].RAM += 1;
            }
            // Só adiciona se NÃO existir já um item com mesmo id e tipoAlerta
            if (!listaAlertas.some(item => item.id === servidor.id && item.tipoAlerta === servidor.tipoAlerta)) {
                listaAlertas.push(servidor);
            }
            if(jsonAlertas[0].CPU > jsonAlertas[0].RAM){
                compMaisAlertas.innerHTML = `CPU`;
        } else if(jsonAlertas[0].RAM > jsonAlertas[0].CPU){
                compMaisAlertas.innerHTML = `RAM`;
            }else {
                compMaisAlertas.innerHTML = `CPU | RAM`;
            }
     
        tabelaServidores.innerHTML = ""; 
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
            `;
        }

        document.querySelectorAll('.button-eye').forEach(button => {
            button.addEventListener('click', function() {
                const servidorId = this.getAttribute('data-id');
                mostrarGraficoServidor(servidorId);
            });
        });
        if (jsonAlertas[0].CPU > jsonAlertas[0].RAM) {
            
        }
        console.log(listaAlertas);
    } 
    }catch (error) {
        console.error("Erro ao buscar alertas:", error);

        alert("Não foi possível carregar os alertas. Por favor, tente novamente mais tarde.");
    }
}

// mostrar gráfico de acordo com o servidor clicado
function mostrarGraficoServidor(servidorId) {
    // Aqui você pode implementar a lógica para buscar os dados do servidor e exibir o gráfico
    console.log(`Exibindo gráfico para o servidor com ID: ${servidorId}`);
    // Exemplo de exibição de gráfico (substitua com sua lógica real)
    const graficoDiv = document.getElementById('graficoServidor');
    graficoDiv.style.display = 'block';
}


buscarServidoresComAlerta();

