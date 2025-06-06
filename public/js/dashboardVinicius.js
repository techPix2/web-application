window.addEventListener('DOMContentLoaded', function () {

    esconderLoading(); 
    let graficoStatus;


async function carregarGraficoStatusChamados(startDate, endDate) {
    try {
        const url = `http://localhost/apiJira/jira-status?start=${startDate}&end=${endDate}`;
        const resposta = await fetch(url);
        const statusData = await resposta.json();

        const statusLabels = Object.keys(statusData);
        const statusValores = Object.values(statusData);

        const corPorStatus = {
            "Work in progress": "#2196f3",
            "Concluída": "#4caf50",
            "Fechada": "#f44336",
            "Reaberto": "#fbc02d",
            "Aberto": "#9c27b0",
            "Pending": "#ff9800",
        };
        const cores = statusLabels.map(label => corPorStatus[label] || "#9e9e9e");

        const container = document.getElementById("graficoStatusCanvas");

        if (graficoStatus) {
            graficoStatus.destroy();
        }

 graficoStatus = new ApexCharts(container, {
    chart: {
        type: 'donut',
        height: 300
    },
    series: statusValores,
    labels: statusLabels,
    colors: cores,
    plotOptions: {
        pie: {
            donut: {
                size: '0%' 
            }
        }
    },
    dataLabels: {
        enabled: true,
        formatter: function (val) {
            return val.toFixed(1) + "%";
        }
    },
    legend: {
        position: 'right'
    }
});

        graficoStatus.render();

    } catch (error) {
        console.error("Erro ao carregar gráfico de status dos chamados:", error);
    }
}



async function listarFuncionarios(startDate, endDate) {
    try {
        let url = "http://localhost/apiJira/jira-funcionarios";
        if (startDate && endDate) {
            url += `?start=${startDate}&end=${endDate}`;
        }

        const resposta = await fetch(url);
        const funcionarios = await resposta.json();

        const lista = document.getElementById("listaFuncionarios");
        lista.innerHTML = "";

        funcionarios.forEach(func => {
            const div = document.createElement("div");
            div.className = "card-funcionario";

            const estiloAtrasados = func.atrasados > 0 
                ? 'style="color: red; font-weight: bold;"' 
                : '';

            const eficiencia = func.eficiencia?.toFixed(1) ?? 0;
            let corEficiência = '';

            if (eficiencia < 30) {
                corEficiência = 'style="color: red; font-weight: bold;"';
            } else if (eficiencia < 70) {
                corEficiência = 'style="color: orange;"';
            } else {
                corEficiência = 'style="color: green;"';
            }

            div.innerHTML = `
                <span>${func.nome}</span>
                <span>${func.recebidos}</span>
                <span>${func.realizados}</span>
                <span ${estiloAtrasados}>${func.atrasados}</span>
                <span ${corEficiência}>${eficiencia}%</span>
            `;

            lista.appendChild(div);
        });

    } catch (error) {
        console.error("Erro ao listar funcionários:", error);
        alert("Erro ao carregar dados dos funcionários: " + error.message);
    }
}


async function buscarKpis(dataInicio, dataFim) {
    try {
        let url = "http://localhost/apiJira/jira-kpis";
        if (dataInicio && dataFim) {
            url += `?filtro=dia&start=${dataInicio}&end=${dataFim}`;
            } else {
                url += "?filtro=status";
            }
            
            const response = await fetch(url);
            const data = await response.json();
            
            const chamadosAbertos = document.querySelectorAll(".kpi-meio")[0];
            const tempoMedio = document.querySelectorAll(".kpi-meio")[1];
            const chamadosResolvidos = document.querySelectorAll(".kpi-meio")[2];
            
            chamadosAbertos.innerText = data.chamadosEmAndamento ?? "-";
            tempoMedio.innerText = data.tempoMedioResolucao ?? "-";
            chamadosResolvidos.innerText = (data.totalChamados - data.chamadosEmAndamento) ?? "-";
            
        } catch (error) {
            console.error("Erro ao buscar KPIs:", error);
        }
}

let graficoChamadosAgrupado;

async function carregarGraficoChamadosPorDia(start, end) {
    if (!start || !end) {
        alert("Por favor, selecione as datas de início e fim.");
        return;
    }

    try {
        const url = `http://localhost/apiJira/jira-chamados-dia-prioridade?start=${start}&end=${end}`;
        const resposta = await fetch(url);
        const dados = await resposta.json();

        const corPorPrioridade = {
            "High": "#ea4335",
            "Medium": "#fbbc04",
            "Low": "#34a853",
            "Highest": "#9c27b0",
            "Sem prioridade": "#9e9e9e"
        };

        const container = document.getElementById('graficoChamadosDia');
        console.log(dados);

        if (graficoChamadosAgrupado) {
            graficoChamadosAgrupado.destroy();
        }

        const series = dados.datasets.map(dataset => ({
            name: dataset.label,
            data: dataset.data
        }));

        const colors = dados.datasets.map(d => corPorPrioridade[d.label] || "#1a73e8");

        graficoChamadosAgrupado = new ApexCharts(container, {
            chart: {
            type: 'bar',
            height: 290,
            stacked: true,
            toolbar: { show: false },
            animations: { enabled: false },
            fontFamily: '"Roboto", sans-serif',
            zoom: { enabled: false }
            },
            series: series,
            xaxis: {
                categories: dados.labels,
                labels: {
                    rotate: -45,
                    style: { fontSize: '12px' }
                },
                title: { text: 'Data' },
                tickPlacement: 'on'
            },
            yaxis: {
                title: { text: 'Quantidade' }
            },
            colors: colors,
            dataLabels: {
                enabled: true,
                style: {
                    fontSize: '12px',
                    colors: ['#fff']
                }
            },
            plotOptions: {
                bar: {
                    columnWidth: '50%',
                    distributed: false
                }
            },
            tooltip: {
                shared: true,
                intersect: false
            },
            legend: {
                position: 'top'
            },
            responsive: [{
                breakpoint: 480,
                options: {
                    chart: { height: 300 },
                    legend: { position: 'bottom' }
                }
            }]
        });

        graficoChamadosAgrupado.render();

    } catch (erro) {
        console.error("Erro ao carregar gráfico:", erro);
        alert("Erro ao carregar gráfico de chamados por dia.");
    }
}


    
const btnFiltrar = this.document.getElementById("filterButton");

  btnFiltrar.addEventListener("click", async () => {
    const startDate = document.getElementById("startDate").value;
    const endDate = document.getElementById("endDate").value;

    if (!startDate || !endDate) {
        alert("Selecione as duas datas para filtrar.");
        return;
    }

    mostrarLoading(); 

    try {
        await Promise.all([
            buscarKpis(startDate, endDate),
            listarFuncionarios(startDate, endDate),
            carregarGraficoStatusChamados(startDate, endDate),
            carregarGraficoChamadosPorDia(startDate, endDate)
        ]);
    } catch (e) {
        console.error("Erro ao filtrar:", e);
        alert("Erro ao carregar dados.");
    } finally {
        esconderLoading(); 
    }
});

});

function mostrarLoading() {
    document.getElementById("loading-overlay").style.display = "flex";
}

function esconderLoading() {
    document.getElementById("loading-overlay").style.display = "none";
}
