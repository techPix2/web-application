import { GoogleGenerativeAI } from "https://esm.run/@google/generative-ai";
import { grupoProcessos } from './grupo_processos.js';
const apiKey = "AIzaSyBKhlQXtdQdWLoQso9xMZDYMf1TFPi6vFU";
const ai = new GoogleGenerativeAI(apiKey);
let consumoComponenteChart, frequenciaCPUChart, barraGrupoProcessoChart, barrasProcessoRAMChart;
let loadingOverlayElement;
let mainContentElement;
const NOME_METRICAS = {
    dia: "dia",
    cpuPercent: "avg_cpu_percent",
    ramPercent: "avg_ram_percent",
    cpuFreq: "avg_cpu_freq"
};
const NOMES_MESES = [
    "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
    "Jul", "Ago", "Set", "Out", "Nov", "Dez"
];

const NOMES_DIAS_SEMANA = [
    "Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado" ]
const GRUPOS_PROCESSOS_CORRIGIDO = grupoProcessos

const COLORS_BY_GROUP = {
    'Sistema': '#FF4560',
    'Aplicação': '#008FFB',
    'Desconhecido': '#00E396',
    'Banco': '#FEB019'
};
const DEFAULT_PROCESS_COLOR = '#808080';

const LIMITE_ALERTA = 60;

let dados = {};
document.addEventListener('DOMContentLoaded', async function () {
    showLoading();
    dados = await filtrarJsonsComTodosPeriodos();
    loadingOverlayElement = document.getElementById('loading-overlay');
    mainContentElement = document.querySelector('custom-main');
    const consumoComponentesOptions = {
        series: [{ name: "%CPU", data: [] }, { name: "%RAM", data: [] }],
        chart: { type: 'line', height: 300 },
        annotations: { yaxis: [{ y: 80, borderColor: 'red', label: { text: 'Limite' } }] },
        title: { text: 'Consumo de Hardware', align: 'left' },
        stroke: { curve: 'smooth' },
        xaxis: { categories: [] }
    };
    consumoComponenteChart = new ApexCharts(document.querySelector("#consumoComponente"), consumoComponentesOptions);
    consumoComponenteChart.render();

    const frequenciaCPUOption = {
        series: [{ name: "Frequência CPU (MHz)", data: [] }],
        chart: { type: 'line', height: 300 },
        title: { text: 'Frequência CPU', align: 'left' },
        stroke: { curve: 'smooth' },
        xaxis: { categories: [] }
    };
    frequenciaCPUChart = new ApexCharts(document.querySelector("#frequenciaCPU"), frequenciaCPUOption);
    frequenciaCPUChart.render();

    const barraGrupoProcessoOptions = {
        series: [
            { name: 'Sistema', data: [] }, { name: 'Aplicação', data: [] },
            { name: 'Desconhecido', data: [] }, { name: 'Banco', data: [] }
        ],
        chart: { type: 'bar', height: 300 },
        title: { text: 'Consumo CPU por Grupo de Processos', align: 'left' },
        colors: [COLORS_BY_GROUP.Sistema, COLORS_BY_GROUP.Aplicação, COLORS_BY_GROUP.Desconhecido, COLORS_BY_GROUP.Banco],
        plotOptions: { bar: { columnWidth: '50%' } },
        xaxis: { categories: ['Consumo médio CPU (%)'] }
    };
    barraGrupoProcessoChart = new ApexCharts(document.querySelector("#barraGrupoProcesso"), barraGrupoProcessoOptions);
    barraGrupoProcessoChart.render();

    const barrasProcessoRAMOptions = {
        series: [{ name: 'Consumo de RAM (Mb)', data: [] }],
        chart: { type: 'bar', height: 300 },
        title: { text: 'Top 5 Processos por RAM', align: 'left' },
        plotOptions: { bar: { horizontal: true, distributed: true } },
        xaxis: { categories: [] },
        legend: { show: false },

    };
    barrasProcessoRAMChart = new ApexCharts(document.querySelector("#barrasProcessoRAM"), barrasProcessoRAMOptions);
    barrasProcessoRAMChart.render();
    await updateAllCharts("30");
    hideLoading()
    try {

    } catch (error) {
        console.error("Erro crítico ao carregar e processar dados iniciais:", error);
        updateAllCharts(periodoSelect.value || "30");
    } finally {
        hideLoading();
    }
});

document.getElementById('periodoSelect').addEventListener('change', async function (event) { updateAllCharts(event.target.value); });

function showLoading() {
    if (loadingOverlayElement) loadingOverlayElement.style.display = 'flex';
    if (mainContentElement) mainContentElement.classList.add('hidden');
}

function hideLoading() {
    if (loadingOverlayElement) loadingOverlayElement.style.display = 'none';
    if (mainContentElement) mainContentElement.classList.remove('hidden');
}

function tratarData(strData) {
    const parts = strData.split('-');
    return new Date(Date.UTC(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2])));
}

function atualizarKPI(metricasDoPeriodo, periodValue) {
    const kpiMesValorElement = document.getElementById('kpi-mes-alertas-valor');
    const kpiDiaSemanaValorElement = document.getElementById('kpi-dia-semana-alertas-valor');
    const kpiComponenteValorElement = document.getElementById('kpi-componente-alertas-valor');
    const kpiMesCardElement = document.getElementById('kpi-card-mes-alertas');

    let textoMesMaisAlertas = "-";
    let textoDiaSemanaMaisAlertas = "-";
    let textoComponenteMaisAlertas = "-";

    
    const contagemAlertasPorMes = {};
    const contagemAlertasPorDiaSemana = {};
    let totalAlertasCPU = 0;
    let totalAlertasRAM = 0;

    for (const metrica of metricasDoPeriodo) {
        const dataMetricaObj = tratarData(metrica['dia']);
        const cpuPercentual = parseFloat(metrica['avg_cpu_percent']);
        const ramPercentual = parseFloat(metrica['avg_ram_percent']);

        if (cpuPercentual > LIMITE_ALERTA || ramPercentual > LIMITE_ALERTA) {
            const mesAno = `${dataMetricaObj.getUTCFullYear()}-${String(dataMetricaObj.getUTCMonth() + 1).padStart(2, '0')}`;
            contagemAlertasPorMes[mesAno] = (contagemAlertasPorMes[mesAno] || 0) + 1;
            const diaSemanaIndex = dataMetricaObj.getUTCDay();
            contagemAlertasPorDiaSemana[diaSemanaIndex] = (contagemAlertasPorDiaSemana[diaSemanaIndex] || 0) + 1;
        }

        if (cpuPercentual > LIMITE_ALERTA) totalAlertasCPU++;
        if (ramPercentual > LIMITE_ALERTA) totalAlertasRAM++;
    }

    let maxAlertasMesCount = 0;
    for (const mesAno in contagemAlertasPorMes) {
        if (contagemAlertasPorMes[mesAno] > maxAlertasMesCount) {
            maxAlertasMesCount = contagemAlertasPorMes[mesAno];
            const [ano, mes] = mesAno.split('-');
            textoMesMaisAlertas = `${NOMES_MESES[parseInt(mes) - 1]}/${ano.slice(-2)}`;
        }
    }

    let maxAlertasDiaSemanaCount = 0;
    for (const diaIdx in contagemAlertasPorDiaSemana) {
        if (contagemAlertasPorDiaSemana[diaIdx] > maxAlertasDiaSemanaCount) {
            maxAlertasDiaSemanaCount = contagemAlertasPorDiaSemana[diaIdx];
            textoDiaSemanaMaisAlertas = NOMES_DIAS_SEMANA[parseInt(diaIdx)];
        }
    }

    if (totalAlertasCPU > totalAlertasRAM) textoComponenteMaisAlertas = "CPU";
    else if (totalAlertasRAM > totalAlertasCPU) textoComponenteMaisAlertas = "RAM";
    else if (totalAlertasCPU > 0) textoComponenteMaisAlertas = "CPU e RAM";


    if (kpiMesCardElement) {
        kpiMesCardElement.style.display = parseInt(periodValue) <= 30 ? 'none' : 'block';
    }

    if (kpiMesValorElement) kpiMesValorElement.textContent = textoMesMaisAlertas;
    if (kpiDiaSemanaValorElement) kpiDiaSemanaValorElement.textContent = textoDiaSemanaMaisAlertas;
    if (kpiComponenteValorElement) kpiComponenteValorElement.textContent = textoComponenteMaisAlertas;
}

function top5ProcessosPorRAM(processos) {
    let topProcessos = []
    for (const dia of processos) {
        for (const processo of dia[1].processos) {
            if (topProcessos.length < 5) {
                topProcessos.push({
                    nome: processo['nome'],
                    ram: processo['memory_percent_media'],
                    color: DEFAULT_PROCESS_COLOR
                });
            } else {
                const menorProcesso = topProcessos.reduce((prev, curr) => (prev.ram < curr.ram ? prev : curr));
                if (processo['memory_percent_media'] > menorProcesso.ram) {
                    topProcessos.splice(topProcessos.indexOf(menorProcesso), 1, {
                        nome: processo['nome'],
                        ram: processo['memory_percent_media'],
                        color: DEFAULT_PROCESS_COLOR
                    });
                }
            }
        }
    }
    topProcessos = topProcessos.sort((a, b) => b.ram - a.ram)
    topProcessos.forEach((processo) => {
        processo.color = COLORS_BY_GROUP['Aplicação'];
        if (GRUPOS_PROCESSOS_CORRIGIDO['Sistema'].includes(processo.nome)) {
            processo.color = COLORS_BY_GROUP['Sistema'];
        } else if (GRUPOS_PROCESSOS_CORRIGIDO['Banco'].includes(processo.nome)) {
            processo.color = COLORS_BY_GROUP['Banco'];
        } else if (GRUPOS_PROCESSOS_CORRIGIDO['Desconhecido'].includes(processo.nome)) {
            processo.color = COLORS_BY_GROUP['Desconhecido'];
        }
    })
    return topProcessos;
}
async function updateAllCharts(periodo) {
    showLoading();
    const acessoMetrica = `ultimos_${periodo}_dias`;

    const metricasDoPeriodo = dados.metricas[acessoMetrica] || [];
    const processosDoPeriodo = dados.processos[acessoMetrica] || [];

    atualizarKPI(metricasDoPeriodo, periodo);
    console.log("Dados de processos para o período:", processosDoPeriodo);
    console.log("Métricas diárias para o período:", metricasDoPeriodo);

    const consumoPorGrupo = calcularMediaPorGrupo(processosDoPeriodo);
    const topProcessos = top5ProcessosPorRAM(processosDoPeriodo);

    if (periodo > 90){
        document.getElementById('graficos_dias').style.flexDirection = 'column';
        document.getElementById('graficos_dias').style.alignItems = 'center';
        document.getElementById('consumoComponente').style.width = 95+'%';
        document.getElementById('frequenciaCPU').style.width = 95+'%'
    } else {
        document.getElementById('graficos_dias').style.removeProperty('align-items');
        document.getElementById('graficos_dias').style.flexDirection = 'row';
        document.getElementById('consumoComponente').style.width = 48+'%';
        document.getElementById('frequenciaCPU').style.width = 48+'%'
    }
    consumoComponenteChart.updateOptions({
        xaxis: { categories: metricasDoPeriodo.map(m => m['dia']) },
        series: [
            { name: "%CPU", data: metricasDoPeriodo.map(m => parseFloat(m['avg_cpu_percent'])) },
            { name: "%RAM", data: metricasDoPeriodo.map(m => parseFloat(m['avg_ram_percent'])) }
        ],
        title: { text: `Consumo de Hardware - Últimos ${periodo} dias` }
    });
    frequenciaCPUChart.updateOptions({
        xaxis: { categories: metricasDoPeriodo.map(m => m['dia']) },
        series: [{
            name: "Frequência CPU (MHz)",
            data: metricasDoPeriodo.map(m => parseFloat(m['avg_cpu_freq']))
        }],
        title: { text: `Frequência CPU - Últimos ${periodo} dias` }
    });

    barraGrupoProcessoChart.updateOptions({
        xaxis: { categories: ['Consumo médio CPU (%)'] },
        series: [
            { name: 'Sistema', data: [consumoPorGrupo['Sistema'] ? consumoPorGrupo['Sistema'].total : 0] },
            { name: 'Aplicação', data: [consumoPorGrupo['Aplicação'] ? consumoPorGrupo['Aplicação'].total : 0] },
            { name: 'Desconhecido', data: [consumoPorGrupo['Desconhecido'] ? consumoPorGrupo['Desconhecido'].total : 0] },
            { name: 'Banco', data: [consumoPorGrupo['Banco'] ? consumoPorGrupo['Banco'].total : 0] }
        ],
        title: { text: `Consumo CPU por Grupo de Processos - Últimos ${periodo} dias` }
    });
    barrasProcessoRAMChart.updateOptions({
        xaxis: { categories: topProcessos.map(p => p.nome) },
        series: [{ name: 'Consumo de RAM (Mb)', data: topProcessos.map(p => p.ram) }],
        title: { text: `Top 5 Processos por RAM - Últimos ${periodo} dias` },
        colors: topProcessos.map(p => p.color)
    });
    hideLoading();
}
function calcularMediaPorGrupo(processos) {
    const mediasPorGrupo = {
        'Sistema': { total: 0, count: 0 },
        'Aplicação': { total: 0, count: 0 },
        'Desconhecido': { total: 0, count: 0 },
        'Banco': { total: 0, count: 0 }
    }
    for (const dia of processos) {
        for (const processo of dia[1].processos) {
            if (GRUPOS_PROCESSOS_CORRIGIDO['Sistema'].includes(processo.nome)) {
                mediasPorGrupo['Sistema'].total += processo.cpu_percent_media;
                mediasPorGrupo['Sistema'].count++
            } else if (GRUPOS_PROCESSOS_CORRIGIDO['Aplicação'].includes(processo.nome)) {
                mediasPorGrupo['Aplicação'].total += processo.cpu_percent_media;
                mediasPorGrupo['Aplicação'].count++
            }
            else if (GRUPOS_PROCESSOS_CORRIGIDO['Banco'].includes(processo.nome)) {
                mediasPorGrupo['Banco'].total += processo.cpu_percent_media;
                mediasPorGrupo['Banco'].count++
            } else {
                mediasPorGrupo['Desconhecido'].total += processo.cpu_percent_media;
                mediasPorGrupo['Desconhecido'].count++
            }
        }
    }
    for (const grupo in mediasPorGrupo) {
        mediasPorGrupo[grupo].total = mediasPorGrupo[grupo].total / mediasPorGrupo[grupo].count;
        mediasPorGrupo[grupo].total = parseFloat(mediasPorGrupo[grupo].total.toFixed(2));
    }
    return mediasPorGrupo;
}
async function listArquivos() {
    try {
        const response = await fetch('/api/s3/arquivos');
        if (!response.ok) {
            console.error(`Erro HTTP ao buscar arquivos: ${response.status}`);
            return { files: [{ data: [] }, { data: {} }] };
        }
        return await response.json();
    } catch (error) {
        console.error('Erro na requisição ao listar arquivos:', error);
        return { files: [{ data: [] }, { data: {} }] };
    }
}

async function filtrarJsonsComTodosPeriodos() {
    const arquivos = await listArquivos();
    const metricas = arquivos.files[0].data || [];
    const processos = [arquivos.files[1].data];
    const metricasOrdenadas = metricas.sort((a, b) => tratarData(a[NOME_METRICAS.dia]) - tratarData(b[NOME_METRICAS.dia]));
    const filtroDados = {
        ultimos_30_dias: metricasOrdenadas.slice(-30),
        ultimos_90_dias: metricasOrdenadas.slice(-90),
        ultimos_180_dias: metricasOrdenadas.slice(-180),
        ultimos_360_dias: metricasOrdenadas.slice(-360)
    };
    const chavesDeData = Object.keys(processos[0])
    function parseDataString(dataStr) {
        const partes = dataStr.split('/');
        if (partes.length !== 3) {
            return new Date(NaN);
        }
        const dia = parseInt(partes[0], 10);
        const mes = parseInt(partes[1], 10) - 1;
        const ano = parseInt(partes[2], 10);
        if (isNaN(dia) || isNaN(mes) || isNaN(ano)) {
            return new Date(NaN);
        }
        const dataObj = new Date(ano, mes, dia);
        if (isNaN(dataObj.getTime()) || dataObj.getFullYear() !== ano || dataObj.getMonth() !== mes || dataObj.getDate() !== dia) {
            return new Date(NaN);
        }

        return dataObj;
    }
    chavesDeData.sort((dataAStr, dataBStr) => {
        const dataA = parseDataString(dataAStr);
        const dataB = parseDataString(dataBStr);
        return dataA - dataB;
    });
    const resultadoOrdenado = chavesDeData.map(chaveData => {
        return [chaveData, processos[0][chaveData]];
    });

    const processosFiltrados = {
        ultimos_30_dias: resultadoOrdenado.slice(-30),
        ultimos_90_dias: resultadoOrdenado.slice(-90),
        ultimos_180_dias: resultadoOrdenado.slice(-180),       
        ultimos_360_dias: resultadoOrdenado.slice(-360)
    };
    return {
        metricas: filtroDados,
        processos: processosFiltrados
    };

}

async function contatarIa() {
    const searchInputElement = document.getElementById('searchInput');
    const inputValue = searchInputElement.value;

    if (!inputValue.trim()) {
        console.log("Input da IA está vazio. Nenhuma ação será tomada.");
        return;
    }

    try {
        const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(inputValue);
        const response = result.response;
        const text = response.text();

        console.log("Resposta da IA:", text);
        alert("Resposta da IA (ver console para detalhes):\n" + text.substring(0, 200) + (text.length > 200 ? "..." : ""));
    } catch (error) {
        console.error("Erro ao contatar IA:", error);
        alert("Erro ao contatar a IA. Verifique o console para mais detalhes.");
    }
}