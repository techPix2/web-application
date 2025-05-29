
window.addEventListener('DOMContentLoaded', function () {

    // LISTAGEM 

    const funcionarios = [
        { nome: "teste ", recebidos: 18, realizados: 20, atrasados: 3 },
        { nome: "teste ", recebidos: 18, realizados: 28, atrasados: 1 },
        { nome: "teste ", recebidos: 18, realizados: 15, atrasados: 2 },
        { nome: "teste ", recebidos: 18, realizados: 15, atrasados: 4 },
        { nome: "teste ", recebidos: 18, realizados: 15, atrasados: 6 },
        { nome: "teste ", recebidos: 18, realizados: 15, atrasados: 8 },
        { nome: "teste ", recebidos: 18, realizados: 15, atrasados: 10 },
        { nome: "teste ", recebidos: 18, realizados: 15, atrasados: 12 }
    ];

    const lista = document.getElementById("listaFuncionarios");

    funcionarios.forEach(func => {
        const div = document.createElement("div");
        div.className = "card-funcionario";
        div.innerHTML = `
            <span>${func.nome}</span>
            <span>${func.recebidos}</span>
            <span>${func.realizados}</span>
            <span>${func.atrasados}</span>
        `;
        lista.appendChild(div);
    });
    
    // GRÁFICO EMPRESAS

    const empresasComMaisAlertas = [
        { nome: "servidor 1", alertas: 32 },
        { nome: "servidor 2", alertas: 27 },
        { nome: "servidor 3", alertas: 21 },
        { nome: "servidor 4", alertas: 18 },
        { nome: "servidor 5", alertas: 16 }
    ];

    const ctx = document.getElementById('graficoServidores').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: empresasComMaisAlertas.map(e => e.nome),
            datasets: [{
                label: 'Alertas por servidor',
                data: empresasComMaisAlertas.map(e => e.alertas),
                backgroundColor: 'rgba(255, 99, 132, 0.6)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1,
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    title: { display: true, text: 'Quantidade de chamados' }
                },
                x: {
                    title: { display: true, text: 'Servidor' }
                }
            },
            plugins: {
                legend: { display: false },
                title: {
                    display: false
                }
            }
        }
    }); 
});