let periodoAtual = 'HOUR';
let tempoAtual = 1;

async function carregarAlertas() {
    await filtrarPorPeriodo('HOUR', 1);
}

async function filtrarPorPeriodo(periodo, tempo) {
    periodoAtual = periodo;
    tempoAtual = tempo;
    
    const botoes = document.querySelectorAll('.filtroBtn');
    botoes.forEach(btn => btn.classList.remove('active'));
    
    if (periodo === 'HOUR') {
        botoes[0].classList.add('active');
    } else if (periodo === 'DAY') {
        botoes[1].classList.add('active');
    } else if (periodo === 'WEEK') {
        botoes[2].classList.add('active');
    }
    
    await buscarAlertas();
}

async function buscarAlertas() {
    try {
        const fk_company = sessionStorage.ID_EMPRESA || 1;
        const response = await fetch(`/dashCientista/listarTodosAlertas/${fk_company}/${periodoAtual}/${tempoAtual}`);
        
        if (!response.ok) {
            throw new Error(`Erro ao buscar alertas: ${response.status}`);
        }
        
        const alertas = await response.json();
        exibirAlertas(alertas);
    } catch (error) {
        console.error("Erro ao buscar alertas:", error);
        Alert.error("Erro", "Não foi possível carregar os alertas. Por favor, tente novamente mais tarde.");
    }
}

function exibirAlertas(alertas) {
    const tbody = document.getElementById('alertasTableBody');
    tbody.innerHTML = '';
    
    if (alertas.length === 0) {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td colspan="6" style="text-align: center;">Nenhum alerta encontrado para o período selecionado.</td>`;
        tbody.appendChild(tr);
        return;
    }
    
    alertas.forEach(alerta => {
        const tr = document.createElement('tr');
        
        const data = new Date(alerta.dateTime);
        const dataFormatada = `${data.toLocaleDateString()} ${data.toLocaleTimeString()}`;
        
        let statusClass = '';
        if (alerta.severity === 'CRITICAL') {
            statusClass = 'status-critico';
        } else if (alerta.severity === 'WARNING') {
            statusClass = 'status-atencao';
        } else {
            statusClass = 'status-normal';
        }
        
        tr.innerHTML = `
            <td>${dataFormatada}</td>
            <td>${alerta.hostname}</td>
            <td>${alerta.componentName}</td>
            <td class="${statusClass}">${alerta.type}</td>
            <td>${alerta.description || 'Sem descrição'}</td>
            <td>${alerta.position}</td>
        `;
        
        tbody.appendChild(tr);
    });
}