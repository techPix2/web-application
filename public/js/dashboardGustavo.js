var barOptions = {
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
                return "$ " + val + " thousands"
            }
        }
    }
};

var barChart = new ApexCharts(document.getElementById("barChart"), barOptions)

barChart.render()