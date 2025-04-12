
function carregarGraficos(){
    const alertaQuadrante = document.getElementById("alertaQuadrante")
    const alertaComponente = document.getElementById("alertaComponente")
    const componenteMaquina = document.getElementById("componenteMaquina")
    const alertasMaquina = document.getElementById("alertaMaquina")
    
    new Chart(alertaQuadrante, {
        type: 'bar',
        data: {
            labels: ["Quadrante 1", "Quadrante 2", "Quadrante 3", "Quadrante 4"],
            datasets: [{
                label: "Quantidade Alertas",
                data: [15, 20, 5, 10],
                backgroundColor: ['#4868A5'],
                borderColor: '#4868A5',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#ffffff',
                        font: {
                            size: 18
                        }
                    }
                }
            },
            scales: {
                x: {
                    stacked: false,
                    ticks: {
                        color: '#ffffff'
                    }
                },
                y: {
                    ticks: {
                        color: '#ffffff'
                    }
                }
            }
        }
    });  
    new Chart(alertaComponente, {
        type: 'bar',
        data: {
            labels: ["Quadrante 1", "Quadrante 2", "Quadrante 3", "Quadrante 4"],
            datasets: [
                {
                    label: "RAM",
                    data: [5, 6, 1, 3],
                    backgroundColor: '#4868A5',
                    borderColor: '#4868A5',
                    borderWidth: 2
                },
                {
                    label: "CPU",
                    data: [4, 5, 2, 2],
                    backgroundColor: '#58A55C',
                    borderColor: '#58A55C',
                    borderWidth: 2
                },
                {
                    label: "Disco",
                    data: [3, 6, 1, 3],
                    backgroundColor: '#F5B041',
                    borderColor: '#F5B041',
                    borderWidth: 2
                },
                {
                    label: "Processos",
                    data: [3, 3, 1, 2],
                    backgroundColor: '#E74C3C',
                    borderColor: '#E74C3C',
                    borderWidth: 2
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#ffffff',
                        font: {
                            size: 18
                        }
                    }
                }
            },
            scales: {
                x: {
                    stacked: false,
                    ticks: {
                        color: '#ffffff'
                    }
                },
                y: {
                    ticks: {
                        color: '#ffffff'
                    }
                }
            }
        }
    });
    new Chart(componenteMaquina, {
        type: 'line',
        data: {
            labels: ["12:00", "13:00", "14:00", "15:00"],
            datasets: [
                {
                    label: "RAM",
                    data: [5, 6, 1, 3],
                    backgroundColor: '#4868A5',
                    borderColor: '#4868A5',
                    borderWidth: 2
                },
                {
                    label: "CPU",
                    data: [4, 5, 2, 2],
                    backgroundColor: '#58A55C',
                    borderColor: '#58A55C',
                    borderWidth: 2
                },
                {
                    label: "Disco",
                    data: [3, 6, 1, 3],
                    backgroundColor: '#F5B041',
                    borderColor: '#F5B041',
                    borderWidth: 2
                },
                {
                    label: "Processos",
                    data: [3, 3, 1, 2],
                    backgroundColor: '#E74C3C',
                    borderColor: '#E74C3C',
                    borderWidth: 2
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#ffffff',
                        font: {
                            size: 18
                        }
                    }
                }
            },
            scales: {
                x: {
                    stacked: false,
                    ticks: {
                        color: '#ffffff'
                    }
                },
                y: {
                    ticks: {
                        color: '#ffffff'
                    }
                }
            }
        }
    });
    new Chart(alertasMaquina, {
        type: 'line',
        data: {
            labels: ["12:00", "13:00", "14:00", "15:00"],
            datasets: [
                {
                    label: "RAM",
                    data: [5, 6, 1, 3],
                    backgroundColor: '#4868A5',
                    borderColor: '#4868A5',
                    borderWidth: 2
                },
                {
                    label: "CPU",
                    data: [4, 5, 2, 2],
                    backgroundColor: '#58A55C',
                    borderColor: '#58A55C',
                    borderWidth: 2
                },
                {
                    label: "Disco",
                    data: [3, 6, 1, 3],
                    backgroundColor: '#F5B041',
                    borderColor: '#F5B041',
                    borderWidth: 2
                },
                {
                    label: "Processos",
                    data: [3, 3, 1, 2],
                    backgroundColor: '#E74C3C',
                    borderColor: '#E74C3C',
                    borderWidth: 2
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#ffffff',
                        font: {
                            size: 18
                        }
                    }
                }
            },
            scales: {
                x: {
                    stacked: false,
                    ticks: {
                        color: '#ffffff'
                    }
                },
                y: {
                    ticks: {
                        color: '#ffffff'
                    }
                }
            }
        }
    });
    
}



