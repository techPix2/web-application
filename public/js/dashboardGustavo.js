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
        position: 'top',
        enabled: true
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

diskChart.render()

componentsChart.render()