window.addEventListener('DOMContentLoaded', function () {

    let graficoStatus;

async function carregarGraficoStatusChamados(startDate, endDate) {
    try {
        const url = `http://localhost/apiJira/jira-status?start=${startDate}&end=${endDate}`;
        const resposta = await fetch(url);
        const statusData = await resposta.json();

        const statusLabels = Object.keys(statusData);
        const statusValores = Object.values(statusData);

        const canvasId = "graficoStatusCanvas";
        if (!document.getElementById(canvasId)) {
            const canvas = document.createElement("canvas");
            canvas.id = canvasId;
            document.getElementById("graficoStatusChamados").appendChild(canvas);
        }

        if (graficoStatus) {
            graficoStatus.destroy();
        }

        graficoStatus = new Chart(document.getElementById(canvasId), {
            type: "doughnut",
            data: {
                labels: statusLabels,
                datasets: [{
                    label: "Status",
                    data: statusValores,
                    backgroundColor: [
                        "#4caf50", // verde
                        "#ff9800", // laranja
                        "#f44336", // vermelho
                        "#2196f3", // azul
                        "#9c27b0"  // roxo
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'right'
                    }
                }
            }
        });

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
            div.innerHTML = `
                <span>${func.nome}</span>
                <span>${func.recebidos}</span>
                <span>${func.realizados}</span>
                <span ${estiloAtrasados}>${func.atrasados}</span>
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

async function carregarGraficoChamadosPorDia(start, end) {
    if (!start || !end) {
        alert("Por favor, selecione as datas de início e fim.");
        return;
    }

    try {
        const url = `http://localhost/apiJira/jira-chamados-dia-tipo?start=${start}&end=${end}`;
        const resposta = await fetch(url);
        const dados = await resposta.json();

        const cores = ['#1a73e8', '#34a853', '#fbbc04', '#ea4335', '#9c27b0', '#ff5722'];

        if (window.graficoChamadosAgrupado) {
            window.graficoChamadosAgrupado.destroy();
        }

        const ctx = document.getElementById('graficoChamadosDia').getContext('2d');

        window.graficoChamadosAgrupado = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: dados.labels,
                datasets: dados.datasets.map((dataset, index) => ({
                    ...dataset,
                    backgroundColor: cores[index % cores.length]
                }))
            },
            options: {
                responsive: false,
                plugins: {
                    tooltip: {
                        mode: 'index',
                        intersect: false
                    }
                },
                scales: {
                    x: {
                        stacked: true,
                        title: { display: true, text: 'Data' }
                    },
                    y: {
                        beginAtZero: true,
                        stacked: true,
                        title: { display: true, text: 'Quantidade de Chamados' }
                    }
                }
            }
        });

    } catch (erro) {
        console.error("Erro ao carregar gráfico:", erro);
        alert("Erro ao carregar gráfico de chamados por dia.");
    }
}
    
    const btnFiltrar = document.getElementById("filterButton");
    btnFiltrar.addEventListener("click", () => {
    const startDate = document.getElementById("startDate").value;
    const endDate = document.getElementById("endDate").value;

    if (!startDate || !endDate) {
        alert("Selecione as duas datas para filtrar.");
        return;
    }

    buscarKpis(startDate, endDate);
    listarFuncionarios(startDate, endDate);
    carregarGraficoStatusChamados(startDate, endDate);
    carregarGraficoChamadosPorDia(startDate, endDate);
});
});
