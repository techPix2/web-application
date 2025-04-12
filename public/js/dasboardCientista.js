
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



const id = sessionStorage.ID_FUNCIONARIO;


async function listarAlertasMaquinasPorQuadrante(fk_company, quadrante, periodo, tempo) {
    let data;
    try {
        const response = await fetch(`/dashCientista/listarAlertasMaquinasPorQuadrante/${fk_company}/${quadrante}/${periodo}/${tempo}`);
        data = await response.json();
        return data
    } catch (err) {
        console.error(err);
        return {
            position: `${quadrante}`,
            length: 0
        };
    }
}


function listarAlertasPorComponentePorMaquina(fk_company, quadrante, periodo, tempo){
    fetch(`/dashCientista/listarAlertasPorComponentePorMaquina/${fk_company}/${quadrante}/${periodo}/${tempo}`,{
        method:"GET"
    }).then((res) => {
        res.json().then((json)=>{
            console.log(json)
        });
    })
    .catch((err) => {
        console.log(err)
    })
}

async function carregarAlertasTodosQuadrantes(){
    //Os dados estão chumbados, só alterar posteriormente para os dados do sessionStorage
    fk_company = 1
    fk_periodo = "DAY"
    tempo = 15
    const [q1, q2, q3, q4] = await Promise.all([
        listarAlertasMaquinasPorQuadrante(fk_company, 1, fk_periodo, tempo),
        listarAlertasMaquinasPorQuadrante(fk_company, 2, fk_periodo, tempo),
        listarAlertasMaquinasPorQuadrante(fk_company, 3, fk_periodo, tempo),
        listarAlertasMaquinasPorQuadrante(fk_company, 4, fk_periodo, tempo)
    ]);
    return [q1, q2, q3, q4];
}

async function verificarQuadranteComMaisAlertas(){
    var quadrantes =  await carregarAlertasTodosQuadrantes()
    console.log(quadrantes)
    console.log(quadrantes.length)
    let quadranteMaisAlertas = quadrantes[0]
    for (let i = 1; i < quadrantes.length; i++) {
        if (quadrantes[i].length > quadranteMaisAlertas.length){
            quadranteMaisAlertas = quadrantes[i]
        }
    }
    maisAlertasQuadranteKPI.innerHTML= quadranteMaisAlertas[0].position
    return quadranteMaisAlertas
}
async function verificarDiaDaSemana(){
    let quadrante = await verificarQuadranteComMaisAlertas()
    const diaSemanaQuantidade= [0,0,0,0,0,0,0]
    for (let i = 1; i < quadrante.length; i++) {
        const data = new Date(quadrante[i].dateTime).getDay()
        diaSemanaQuantidade[data]+=1
    }
    let maior = diaSemanaQuantidade[0]
    for (let i = 1; i < quadrante.length; i++) {
        if (diaSemanaQuantidade[i] > maior){
            maior = diaSemanaQuantidade[i]
        }
    }
    indice = diaSemanaQuantidade.indexOf(maior)
    switch (indice) {
        case 0:
            maisAlertasDiaKPI.innerHTML = "Domingo"
            break
        case 1:
            maisAlertasDiaKPI.innerHTML =  "Segunda"
            break

        case 2:
            maisAlertasDiaKPI.innerHTML =  "Terça"
            break

        case 3:
            maisAlertasDiaKPI.innerHTML =  "Quarta"
            break

        case 4:
            maisAlertasDiaKPI.innerHTML =  "Quinta"
            break

        case 5:
            maisAlertasDiaKPI.innerHTML =  "Sexta"
            break

        case 6:
            maisAlertasDiaKPI.innerHTML =  "Sábado"
            break
    }
}

async function encontrarComponenteMaisFrequente() {
    let quadrante = await verificarQuadranteComMaisAlertas()
    const contador = {};

    quadrante.forEach(item => {
        const tipo = item.type;
        if (tipo) {
            contador[tipo] = (contador[tipo] || 0) + 1;
        }
    });

    let tipoMaisFrequente = null;
    let maiorContagem = 0;

    for (const tipo in contador) {
        if (contador[tipo] > maiorContagem) {
            maiorContagem = contador[tipo];
            tipoMaisFrequente = tipo;
        }
    }

    maisAlertasComponente.innerHTML = tipoMaisFrequente;
}


function carregarDados() {
    carregarGraficos();
    nome_usuario.innerHTML = sessionStorage.NOME_USUARIO;
}