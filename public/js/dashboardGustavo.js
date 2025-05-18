
// Setup dos Gráficos

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

var componentsOptions = {
    series: [{
        name: "Cpu %",
        data: [10, 41, 35, 51, 49, 62, 69, 91, 98, 10, 41, 35, 51, 49, 62, 69, 91, 98]
    },{
        name: "Ram %",
        data: [20, 31, 30, 50, 40, 32, 78, 10, 20, 20, 31, 30, 50, 40, 32, 78, 10, 20]
    },{
        name: "Disk %",
        data: [50, 51, 52, 53, 54, 55, 56, 57, 58, 50, 51, 52, 53, 54, 55, 56, 57, 58]
    }],
    chart: {
        height: 400,
        type: 'line',
        zoom: {
            enabled: true,
            autoScaleYaxis: true,
            zoomedArea: {
                fill: {
                    color: '#90CAF9',
                    opacity: 0.4
                },
                stroke: {
                    color: '#0D47A1',
                    opacity: 0.4,
                    width: 1
                }
            }
        }
    },
    dataLabels: {
        enabled: false
    },
    stroke: {
        curve: 'straight',
        width: 2,
    },
    title: {
        text: 'Componentes ao longo do Tempo',
        align: 'center',
        style: {
            fontSize:  '24px',
            fontWeight:  'bold',
            fontFamily:  'inter',
            color:  '#263238'
        },
    },
    grid: {
        row: {
            colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
            opacity: 0.5
        },
    },
    xaxis: {
        categories: ['20/05/2025', '21/05/2025', '22/05/2025', '23/05/2025', '24/05/2025', '25/05/2025', '26/05/2025', '27/05/2025', '28/05/2025', '20/05/2025', '21/05/2025', '22/05/2025', '23/05/2025', '24/05/2025', '25/05/2025', '26/05/2025', '27/05/2025', '28/05/2025'],
        max: 10,
    },
    markers: {
        shape: 'diamond',
        size: 5,
    }
};

var componentsChart = new ApexCharts(document.getElementById("componentsChart"), componentsOptions)

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
    markers: {
        shape: 'circle',
        size: 4,
        fillOpacity: 1,
        strokeColors: ['#8979FF', '#FF928A'],
        colors: '#FFF'
    }
}

var packageChart = new ApexCharts(document.getElementById("packageChart"), packageOptions)

var saturationValue = 20;
var saturationColor = '#ff0000';

if (saturationValue > 90) {
    saturationColor = '#00ff00';
} else if (saturationValue > 60) {
    saturationColor = '#ffff00';
}

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

diskChart.render()

componentsChart.render()

packageChart.render()

saturationChart.render()

// DropList
