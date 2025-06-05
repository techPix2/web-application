
var diskOptions = {
    series: [{
        name: 'NBX1024FC',
        data: [44, 55, 57]
    }, {
        name: 'BDSJ129342DS',
        data: [76, 85, 100]
    }, {
        name: 'JFLSJC120334',
        data: [35, 41, 36]
    }],
    title: {
      text: 'Comparação disco das máquinas',
      align: 'center',
        style: {
            fontSize:  '24px',
            fontWeight:  'bold',
            fontFamily:  'inter',
            color:  '#263238'
        },
    },
    chart: {
        type: 'bar',
        height: 400
    },
    plotOptions: {
        bar: {
            horizontal: false,
            columnWidth: '55%',
            borderRadius: 5,
            borderRadiusApplication: 'end',
            colors: {
                backgroundBarColors: ['rgba(214,219,237,0.4)']
            }

        },
    },
    dataLabels: {
        textAnchor: 'middle',
        enabled: true,
    },
    stroke: {
        show: true,
        width: 2,
        colors: ['transparent']
    },
    xaxis: {
        categories: ['Disco C', 'Disco D', 'Disco E'],
    },
    yaxis: {
        title: {
            text: '% (usado)',
            style: {
                fontSize: '16px'
            }
        }
    },
    fill: {
        opacity: 1
    },
    tooltip: {
        y: {
            formatter: function (val) {
                return  val + "%" + " (usado)"
            }
        }
    }
};

var diskChart = new ApexCharts(document.getElementById("diskChart"), diskOptions)

const componentsOptions = {
    series: [],
    chart: {
        id: 'componentesChart',
        height: 400,
        type: 'line',
        toolbar: {
            show: true,
            tools: {
                download: true,
                selection: true,
                zoom: true,
                zoomin: true,
                zoomout: true,
                pan: true,
                reset: true
            },
            autoSelected: 'zoom'
        },
        zoom: {
            enabled: true,
            autoScaleYaxis: true,
            zoomedArea: {
                fill: { color: '#90CAF9', opacity: 0.4 },
                stroke: { color: '#0D47A1', opacity: 0.4, width: 1 }
            }
        }
    },
    dataLabels: { enabled: false },
    stroke: { curve: 'straight', width: 2 },
    title: {
        text: 'Percentual de Uso',
        align: 'center',
        style: {
            fontSize: '24px',
            fontWeight: 'bold',
            fontFamily: 'inter',
            color: '#263238'
        }
    },
    grid: {
        row: {
            colors: ['#f3f3f3', 'transparent'],
            opacity: 0.5
        }
    },
    xaxis: {
        categories: [],
        max: 5
    },
    yaxis: {
        title: {
            text: 'Porcentagem (%)',
            style: {
                fontSize: '12px',
                fontWeight: 'bold',
                fontFamily: 'inter',
                color: '#263238'
            }
        },
        min: 0,
        max: 100,
        forceNiceScale: true,
        labels: {
            formatter: function(value) {
                return value + '%';
            }
        }
    },
    markers: {
        shape: 'diamond',
        size: 5
    }
};

const chartComponentes = new ApexCharts(document.querySelector("#componentsChart"), componentsOptions);

var packageOptions ={
    series: [{
        name: "Pacotes enviados",
        data: [100000, 200000, 350000, 200000, 200000, 400000, 700000, 750000, 862420, 650120],
        color: ['#8979FF']
    },{
        name: "Pacotes recebidos",
        data: [650120, 862420, 750000, 700000, 400000, 200000, 200000, 350000, 200000, 100000],
        color: ['#FF928A']
    }],
    chart: {
        type: 'area',
        height: 400,
        zoom: {
            enabled: false
        }
    },
    dataLabels: {
        enabled: false
    },
    stroke: {
        width: 1,
        curve: 'smooth'
    },
    title: {
        text: 'Análise de pacotes',
        align: 'center',
        style: {
            fontSize:  '24px',
            fontWeight:  'bold',
            fontFamily:  'inter',
            color:  '#263238'
        },
    },
    subtitle: {
        text: 'Pacotes enviados e recebidos',
        align: 'center'
    },
    labels: ['2020/05/01','2020/05/02','2020/05/03','2020/05/04','2020/05/05','2020/05/06','2020/05/07','2020/05/08','2020/05/09','2020/05/10'],
    xaxis: {
        type: 'datetime',
    },
    yaxis: {
        opposite: false
    },
    legend: {
        horizontalAlign: 'center'
    },
    // markers: {
    //     shape: 'circle',
    //     size: 4,
    //     fillOpacity: 1,
    //     strokeColors: ['#8979FF', '#FF928A'],
    //     colors: '#FFF'
    // }
}

var packageChart = new ApexCharts(document.getElementById("packageChart"), packageOptions)

var saturationValue = 20;

var saturationColor = '#ff0000';

var saturationOptions = {
    chart: {
        height: 150,
        width: 200,
        type: "radialBar",
    },
    series: [saturationValue],
    colors: [saturationColor],
    plotOptions: {
        radialBar: {
            startAngle: -90,
            endAngle: 90,
            track: {
                background: '#333',
                startAngle: -90,
                endAngle: 90,
            },
            dataLabels: {
                name: {
                    show: false,
                },
                value: {
                    fontSize: "20px",
                    show: true
                }
            }
        }
    },
    fill: {
        type: "gradient",
        gradient: {
            shade: "light",
            type: "horizontal",
        }
    },
    stroke: {
        lineCap: "butt"
    },
    labels: ["Progress"]
}

var saturationChart = new ApexCharts(document.getElementById("saturationChart"), saturationOptions)

saturationChart.render()

diskChart.render()

packageChart.render()

chartComponentes.render();

function getSaturationColor(value) {
    if (value >= 90) return "#ff4d4d"; // vermelho
    if (value >= 75) return "#ffa500"; // laranja
    if (value >= 50) return "#f1c40f"; // amarelo
    return "#2ecc71"; // verde
}

document.getElementById('selectMaquina').addEventListener('change', function () {
    const idMaquinaSelecionada = this.value;
    console.log("🔁 Máquina selecionada:", idMaquinaSelecionada);

    // DEBUG: ver todas as máquinas disponíveis
    console.log("🔍 Todas as máquinas disponíveis:");
    dadosPorMaquinaGlobal.forEach(m => console.log(m.maquina));

    // DEBUG: ver conteúdo da máquina selecionada
    const maquinaData = dadosPorMaquinaGlobal.find(m => m.maquina === idMaquinaSelecionada);
    console.log("📦 Dados da máquina selecionada:", maquinaData);

    const alertasMaquinaSelecionada = calcularAlertasMaquinaSelecionada(dadosPorMaquinaGlobal, idMaquinaSelecionada);
    console.log("🚨 Total de alertas:", alertasMaquinaSelecionada);

    // ⚙️ Atualiza gráfico de componentes
    plotarGraficoComponentes(dadosPorMaquinaGlobal, idMaquinaSelecionada);
    plotarGraficoPacotes(dadosPorMaquinaGlobal, idMaquinaSelecionada);

    // ⚙️ Calcula e atualiza saturação
    const saturacao = calcularSaturacaoMaquinaSelecionada(dadosPorMaquinaGlobal, idMaquinaSelecionada);
    const saturacaoArredondada = parseFloat(saturacao.toFixed(2));
    const cor = getSaturationColor(saturacaoArredondada);
    saturationChart.updateOptions({ colors: [cor] });
    saturationChart.updateSeries([saturacaoArredondada]);

    // Atualiza valor textual da saturação
    const elementoSelecionada = document.getElementById("saturacaoMaquinaSelecionada");
    if (elementoSelecionada) {
        elementoSelecionada.innerText = `${idMaquinaSelecionada}: ${saturacaoArredondada}%`;
    }

    // Atualiza número de alertas
    const maquinaSelecionada = document.getElementById("alertasMaquina");
    if(maquinaSelecionada) {
        maquinaSelecionada.innerText = `${alertasMaquinaSelecionada}`;
    }
});

function popularSelectMaquinas(dadosPorMaquinaGlobal) {
    const select = document.getElementById('selectMaquina');
    const maquinasArray = Object.values(dadosPorMaquinaGlobal);

    select.innerHTML = "";

    maquinasArray.forEach(maquina => {
        const option = document.createElement('option');
        option.value = maquina.maquina;
        option.textContent = maquina.maquina;
        select.appendChild(option);
    });

    if (maquinasArray.length > 0) {
        const primeiraMaquina = maquinasArray[0].maquina;
        select.value = primeiraMaquina;

        plotarGraficoComponentes(dadosPorMaquinaGlobal, primeiraMaquina);
        plotarGraficoPacotes(dadosPorMaquinaGlobal, primeiraMaquina);
        atualizarListaDeProcessos(dadosPorMaquinaGlobal)

        // Cálculo de saturação
        const saturacao = calcularSaturacaoMaquinaSelecionada(dadosPorMaquinaGlobal, primeiraMaquina);
        const saturacaoArredondada = parseFloat(saturacao.toFixed(2));
        const cor = getSaturationColor(saturacaoArredondada);

        // Cálculo de alertas
        const alertasMaquina = calcularAlertasMaquinaSelecionada(dadosPorMaquinaGlobal, primeiraMaquina);

        // Atualiza gráfico radial
        if (saturationChart) {
            saturationChart.updateOptions({
                colors: [cor],
                series: [saturacaoArredondada]
            }, true, true);
        }

        // Atualiza texto de saturação
        const elementoSelecionada = document.getElementById("saturacaoMaquinaSelecionada");
        if (elementoSelecionada) {
            elementoSelecionada.innerText = `${primeiraMaquina}: ${saturacaoArredondada}%`;
        }

        // Atualiza texto de alertas
        const alertaSpan = document.getElementById("alertasMaquina");
        if (alertaSpan) {
            alertaSpan.innerText = `${alertasMaquina}`;
        }
    }
}

function plotarGraficoComponentes(dadosPorMaquinaGlobal, idMaquinaSelecionada) {
    const maquinasArray = Object.values(dadosPorMaquinaGlobal);

    const dadosMaquina = maquinasArray.find(maquina => maquina.maquina === idMaquinaSelecionada)?.content;

    if (!dadosMaquina || dadosMaquina.length === 0) {
        console.error('Dados da máquina não encontrados ou vazios para o ID:', idMaquinaSelecionada);
        return;
    }

    const categorias = dadosMaquina.map(item => item.data_hora);

    const series = [{
        name: 'Uso de CPU (%)',
        data: dadosMaquina.map(item => parseFloat(item.cpu_percent))
    }];

    series.push({
        name: 'Uso de RAM (%)',
        data: dadosMaquina.map(item => parseFloat(item.ram_percent))
    });

    const discos = [];
    const primeiroRegistro = dadosMaquina[0];

    for (const key in primeiroRegistro) {
        if (key.startsWith('disco_') && key.endsWith('_percent')) {
            const discoNome = key.split('_')[1].toUpperCase();
            if (!discos.includes(discoNome)) {
                discos.push(discoNome);
            }
        }
    }

    if (discos.length > 0) {
        const mediaDiscos = dadosMaquina.map(item => {
            let soma = 0;
            let contador = 0;

            discos.forEach(disco => {
                const value = item[`disco_${disco}_percent`];
                if (value) {
                    soma += parseFloat(value);
                    contador++;
                }
            });

            return contador > 0 ? soma / contador : 0;
        });

        series.push({
            name: 'Média de Discos (%)',
            data: mediaDiscos
        });
    }

    chartComponentes.updateOptions({
        xaxis: { categories: categorias, max: 5 },
        series: series
    });
}

function plotarGraficoDiscoComparativo(dadosPorMaquinaGlobal) {
    const maquinasArray = Object.values(dadosPorMaquinaGlobal);

    const discosSet = new Set();

    maquinasArray.forEach(maquina => {
        const primeiroRegistro = maquina.content?.[0];
        if (!primeiroRegistro) return;

        for (const key in primeiroRegistro) {
            if (key.startsWith('disco_') && key.endsWith('_percent')) {
                const discoNome = key.split('_')[1].toUpperCase();
                discosSet.add(discoNome);
            }
        }
    });

    const discos = Array.from(discosSet).sort();

    const series = maquinasArray.map(maquina => {
        const dados = maquina.content;
        if (!dados || dados.length === 0) return null;

        const mediasDiscos = discos.map(disco => {
            let soma = 0;
            let contador = 0;

            dados.forEach(item => {
                const valor = item[`disco_${disco}_percent`];
                if (valor !== undefined) {
                    soma += parseFloat(valor);
                    contador++;
                }
            });

            return contador > 0 ? parseFloat((soma / contador).toFixed(2)) : null;
        });

        return {
            name: maquina.maquina,
            data: mediasDiscos
        };
    }).filter(Boolean);

    diskChart.updateOptions({
        series: series,
        xaxis: {
            categories: discos.map(disco => `Disco ${disco}`)
        }
    });
}

function calcularMaiorSaturacao(dadosPorMaquinaGlobal) {
    let maiorSaturacao = 0;
    let maquinaMaisSaturada = "";

    dadosPorMaquinaGlobal.forEach(maquina => {
        const nomeMaquina = maquina.maquina;

        maquina.content.forEach(item => {
            const cpu = parseFloat(item.cpu_percent?.replace(",", ".") || 0);
            const ram = parseFloat(item.ram_percent?.replace(",", ".") || 0);

            const discoPercents = Object.entries(item)
                .filter(([key, _]) => key.startsWith("disco_") && key.endsWith("_percent"))
                .map(([_, value]) => parseFloat(value?.replace(",", ".") || 0));

            const discoMax = Math.max(...discoPercents, 0);

            const saturacao = (cpu * 0.4) + (ram * 0.3) + (discoMax * 0.3);

            if (saturacao > maiorSaturacao) {
                maiorSaturacao = saturacao;
                maquinaMaisSaturada = nomeMaquina;
            }
        });
    });

    const elemento = document.getElementById("maiorSaturacao");
    if (elemento) {
        elemento.innerText = maquinaMaisSaturada || "N/A";
    }
}

function calcularSaturacaoMaquinaSelecionada(dados, idMaquina) {
    const maquina = dados.find(m => m.maquina === idMaquina);
    if (!maquina || !maquina.content.length) return 0;

    // Pegamos o último registro (mais recente)
    const ultimo = maquina.content[maquina.content.length - 1];

    const cpu = parseFloat(ultimo.cpu_percent?.replace(",", ".") || 0);
    const ram = parseFloat(ultimo.ram_percent?.replace(",", ".") || 0);

    const discoPercents = Object.entries(ultimo)
        .filter(([key]) => key.startsWith("disco_") && key.endsWith("_percent"))
        .map(([_, value]) => parseFloat(value?.replace(",", ".") || 0));

    const discoMax = Math.max(...discoPercents, 0);

    const saturacao = (cpu * 0.4) + (ram * 0.3) + (discoMax * 0.3);

    return saturacao;
}

function calcularMaquinaComMaisAlertas(dadosPorMaquinaGlobal) {
    let maquinaComMaisAlertas = null;
    let maxAlertas = 0;

    dadosPorMaquinaGlobal.forEach(maquina => {
        const nomeMaquina = maquina.maquina;
        let alertasMaquina = 0;

        maquina.content.forEach(item => {
            const cpu = parseFloat(item.cpu_percent?.replace(",", ".") || 0);
            const ram = parseFloat(item.ram_percent?.replace(",", ".") || 0);

            const discoPercents = Object.entries(item)
                .filter(([key]) => key.startsWith("disco_") && key.endsWith("_percent"))
                .map(([_, value]) => parseFloat(value?.replace(",", ".") || 0));

            const discoAcima = discoPercents.some(p => p > 80);
            const cpuAcima = cpu > 80;
            const ramAcima = ram > 80;

            if (cpuAcima || ramAcima || discoAcima) {
                alertasMaquina += 1;
            }
        });

        if (alertasMaquina > maxAlertas) {
            maxAlertas = alertasMaquina;
            maquinaComMaisAlertas = nomeMaquina;
        }
    });

    // Atualiza os elementos no HTML
    const spanMaquina = document.getElementById("maiorAlertas");
    const spanNumero = document.getElementById("numeroAlertas");

    if (spanMaquina) {
        spanMaquina.innerText = maquinaComMaisAlertas || "N/A";
    }

    if (spanNumero) {
        spanNumero.innerText = `(${maxAlertas.toString()}) Alertas`;
    }

    return {
        maquina: maquinaComMaisAlertas,
        totalAlertas: maxAlertas
    };
}

function calcularAlertasMaquinaSelecionada(dados, idMaquina) {
    const idMaquinaNormalizada = idMaquina.toLowerCase();

    // Encontra a máquina com o nome normalizado
    const maquina = dados.find(m => m.maquina.toLowerCase() === idMaquinaNormalizada);
    if (!maquina || !maquina.content.length) return 0;

    let totalAlertas = 0;

    maquina.content.forEach(item => {
        const cpu = parseFloat(item.cpu_percent?.replace(",", ".") || 0);
        const ram = parseFloat(item.ram_percent?.replace(",", ".") || 0);

        const discoPercents = Object.entries(item)
            .filter(([key]) => key.startsWith("disco_") && key.endsWith("_percent"))
            .map(([_, value]) => parseFloat(value?.replace(",", ".") || 0));

        const discoAcima = discoPercents.some(p => p > 80);
        const cpuAcima = cpu > 80;
        const ramAcima = ram > 80;

        if (cpuAcima || ramAcima || discoAcima) {
            totalAlertas += 1;
        }
    });

    return totalAlertas;
}

function plotarGraficoPacotes(dadosPorMaquinaGlobal, idMaquinaSelecionada) {
    const maquina = dadosPorMaquinaGlobal.find(m => m.maquina === idMaquinaSelecionada);
    if (!maquina || !maquina.content || maquina.content.length === 0) {
        console.warn("📭 Dados de pacotes não encontrados para:", idMaquinaSelecionada);
        return;
    }

    const dadosMaquina = maquina.content;

    const labels = dadosMaquina.map(item => item.data_hora);
    const enviados = dadosMaquina.map(item => parseInt(item.sendPackages || 0));
    const recebidos = dadosMaquina.map(item => parseInt(item.receivePackages || 0));

    const options = {
        series: [
            {
                name: "Pacotes enviados",
                data: enviados,
                color: '#8979FF'
            },
            {
                name: "Pacotes recebidos",
                data: recebidos,
                color: '#FF928A'
            }
        ],
        chart: {
            type: 'area',
            height: 400,
            zoom: { enabled: false }
        },
        dataLabels: { enabled: false },
        stroke: { width: 1, curve: 'smooth' },
        title: {
            text: 'Análise de pacotes',
            align: 'center',
            style: {
                fontSize: '24px',
                fontWeight: 'bold',
                fontFamily: 'inter',
                color: '#263238'
            }
        },
        subtitle: {
            text: 'Pacotes enviados e recebidos',
            align: 'center'
        },
        labels: labels,
        xaxis: { type: 'category' },
        yaxis: { opposite: false },
        legend: { horizontalAlign: 'center' },
        // markers: {
        //     shape: 'circle',
        //     size: 4,
        //     fillOpacity: 1,
        //     strokeColors: ['#8979FF', '#FF928A'],
        //     colors: '#FFF'
        // }
    };

    const chartElement = document.getElementById("packageChart");
    if (!chartElement) {
        console.error("Elemento com ID 'packageChart' não encontrado.");
        return;
    }

    // Destroi gráfico antigo se necessário
    if (window.packageChart) {
        window.packageChart.destroy();
    }

    // Cria novo gráfico e salva em uma variável global para uso futuro
    window.packageChart = new ApexCharts(chartElement, options);
    window.packageChart.render();
}

async function atualizarListaDeProcessos(dadosPorMaquinaGlobal) {
    const container = document.getElementById('processContainer');
    container.innerHTML = ''; // Limpa processos anteriores

    const mobuIds = dadosPorMaquinaGlobal.map(m => m.maquina); // Pegamos os nomes das máquinas (mobuIds)

    try {
        const resposta = await fetch('/process/listar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ mobuIds })
        });

        const dados = await resposta.json();

        if (dados.processes && dados.processes.length > 0) {
            dados.processes.forEach(processo => {
                const div = document.createElement('div');
                div.className = 'process';

                const nome = document.createElement('span');
                nome.className = 'processText';
                nome.textContent = processo.nameProcess;

                const maquina = document.createElement('span');
                maquina.className = 'processText';

                // Truncar mobuId se maior que 10 caracteres
                const mobuIdTruncado = processo.mobuId.length > 10
                    ? processo.mobuId.slice(0, 10) + '…'
                    : processo.mobuId;

                maquina.textContent = mobuIdTruncado;

                const cpu = document.createElement('span');
                cpu.className = 'processText';
                cpu.textContent = `${processo.cpu_percent}%`;

                const data = document.createElement('span');
                data.className = 'processText';
                data.textContent = new Date(processo.dtTime).toLocaleString('pt-BR');

                div.appendChild(nome);
                div.appendChild(maquina);
                div.appendChild(cpu);
                div.appendChild(data);

                container.appendChild(div);
            });
        } else {
            const div = document.createElement('div');
            div.textContent = 'Nenhum processo encontrado.';
            container.appendChild(div);
        }

    } catch (erro) {
        console.error('Erro ao buscar processos:', erro);
        const erroDiv = document.createElement('div');
        erroDiv.textContent = 'Erro ao carregar processos.';
        container.appendChild(erroDiv);
    }
}
