require('dotenv').config();
const express = require('express');
const router = express.Router();
const axios = require('axios');

router.get('/jira-kpis', async (req, res) => {
    const { filtro, start, end } = req.query;

    try {
        let jql;

        if (filtro === 'status') {
            jql = process.env.JQL_QUERY;
        } else if (filtro === 'dia') {
            if (start && end) {
                jql = `created >= "${start}" AND created <= "${end}"`;
            } else {
                jql = process.env.JQL_DIA;
            }
        } else {
            return res.status(400).json({ error: 'Parâmetro "filtro" inválido. Use ?filtro=status ou ?filtro=dia' });
        }

        const auth = Buffer.from(`${process.env.JIRA_USER}:${process.env.JIRA_API_TOKEN}`).toString('base64');
        const url = `https://${process.env.JIRA_DOMAIN}/rest/api/2/search?jql=${encodeURIComponent(jql)}&maxResults=100`;

        const response = await axios.get(url, {
            headers: {
                'Authorization': `Basic ${auth}`,
                'Accept': 'application/json'
            }
        });

        const issues = response.data.issues;
        const totalChamados = response.data.total || issues.length;
        const chamadosEmAndamento = issues.filter(issue => !issue.fields.resolutiondate).length;

        let resolvidos = 0;
        let somaTempos = 0;

        issues.forEach(issue => {
            const created = new Date(issue.fields.created);
            const resolved = issue.fields.resolutiondate ? new Date(issue.fields.resolutiondate) : null;

            if (resolved) {
                resolvidos++;
                somaTempos += (resolved - created);
            }
        });

        let tempoMedioResolucao = null;
        if (resolvidos > 0) {
            const mediaMin = somaTempos / resolvidos / (1000 * 60);
            tempoMedioResolucao = `${Math.round(mediaMin)} minutos`;
        }

        res.json({
            totalChamados,
            chamadosEmAndamento,
            tempoMedioResolucao
        });

    } catch (error) {
        console.error('Erro ao buscar dados do Jira:', error.message);
        res.status(500).json({ error: 'Erro ao buscar dados do Jira', detalhe: error.message });
    }
});


router.get('/jira-funcionarios', async (req, res) => {
    try {
        const auth = Buffer.from(`${process.env.JIRA_USER}:${process.env.JIRA_API_TOKEN}`).toString('base64');
        const { start, end } = req.query;

        let jql = 'project = TECH AND assignee IS NOT EMPTY';
        if (start && end) {
            jql += ` AND created >= "${start}" AND created <= "${end}"`;
        } else {
            jql += ' AND created >= -30d';
        }

        let startAt = 0;
        const maxResults = 100;
        let issues = [];
        let total;

        do {
            const url = `https://${process.env.JIRA_DOMAIN}/rest/api/2/search?jql=${encodeURIComponent(jql)}&startAt=${startAt}&maxResults=${maxResults}`;
            const response = await axios.get(url, {
                headers: {
                    'Authorization': `Basic ${auth}`,
                    'Accept': 'application/json'
                }
            });

            issues.push(...response.data.issues);
            total = response.data.total;
            startAt += maxResults;
        } while (startAt < total);

        const funcionarios = {};

        for (const issue of issues) {
            const fields = issue.fields || {};
            const responsavel = fields.assignee?.displayName || "Sem responsável";
            const status = fields.status?.name || "Indefinido";

            if (!funcionarios[responsavel]) {
                funcionarios[responsavel] = { nome: responsavel, recebidos: 0, realizados: 0, atrasados: 0 };
            }

            funcionarios[responsavel].recebidos++;

            const statusLower = status.toLowerCase();
            const isFeito = statusLower === 'done' || statusLower === 'concluído';

            if (isFeito) {
                funcionarios[responsavel].realizados++;
            }

            const created = new Date(fields.created);
            const hoje = new Date();
            const dias = (hoje - created) / (1000 * 60 * 60 * 24);

            if (dias > 1 && !isFeito) {
                funcionarios[responsavel].atrasados++;
            }
        }

   const resultado = Object.values(funcionarios).map(func => {
    const eficiencia = func.recebidos > 0 
        ? (func.realizados / func.recebidos) * 100 
        : 0;
    return {
        ...func,
        eficiencia: Number(eficiencia.toFixed(1))
    };
});
        res.json(resultado);
    } catch (error) {
        console.error("Erro ao buscar dados dos funcionários:", error);
        res.status(500).json({ error: "Erro ao buscar dados dos funcionários" });
    }
});

router.get('/jira-status', async (req, res) => {
    const { start, end } = req.query;

    if (!start || !end) {
        return res.status(400).json({ error: 'Parâmetros "start" e "end" são obrigatórios.' });
    }

    try {
        const auth = Buffer.from(`${process.env.JIRA_USER}:${process.env.JIRA_API_TOKEN}`).toString('base64');
        const jql = `created >= "${start}" AND created <= "${end}"`;

        const url = `https://${process.env.JIRA_DOMAIN}/rest/api/2/search?jql=${encodeURIComponent(jql)}&maxResults=100`;

        const response = await axios.get(url, {
            headers: {
                'Authorization': `Basic ${auth}`,
                'Accept': 'application/json'
            }
        });

        const issues = response.data.issues;

        const contagemPorStatus = {};

        issues.forEach(issue => {
            const status = issue.fields.status?.name || "Indefinido";
            contagemPorStatus[status] = (contagemPorStatus[status] || 0) + 1;
        });

        res.json(contagemPorStatus);

    } catch (error) {
        console.error("Erro ao buscar status dos chamados:", error);
        if (error.response) {
            console.error("Status:", error.response.status);
            console.error("Data:", error.response.data);
        }

        res.status(500).json({ error: "Erro ao buscar status dos chamados" });
    }
});
router.get('/jira-chamados-dia-prioridade', async (req, res) => {
    const { start, end } = req.query;

    if (!start || !end) {
        return res.status(400).json({ error: 'Parâmetros "start" e "end" são obrigatórios.' });
    }

    try {
        const jql = `created >= "${start}" AND created <= "${end}"`;
        const auth = Buffer.from(`${process.env.JIRA_USER}:${process.env.JIRA_API_TOKEN}`).toString('base64');
        const url = `https://${process.env.JIRA_DOMAIN}/rest/api/2/search?jql=${encodeURIComponent(jql)}&maxResults=100`;

        const response = await axios.get(url, {
            headers: {
                'Authorization': `Basic ${auth}`,
                'Accept': 'application/json'
            }
        });

        const issues = response.data.issues;
        const dadosAgrupados = {};
        const prioridadesSet = new Set();

        issues.forEach(issue => {
            const data = new Date(issue.fields.created);
            const prioridade = issue.fields.priority?.name || "Sem prioridade";
            const diaFormatado = data.toISOString().split("T")[0];

            prioridadesSet.add(prioridade);

            if (!dadosAgrupados[diaFormatado]) {
                dadosAgrupados[diaFormatado] = {};
            }

            if (!dadosAgrupados[diaFormatado][prioridade]) {
                dadosAgrupados[diaFormatado][prioridade] = 0;
            }

            dadosAgrupados[diaFormatado][prioridade]++;
        });

        const labels = Object.keys(dadosAgrupados).sort();
        const prioridades = Array.from(prioridadesSet);

        const datasets = prioridades.map(prioridade => ({
            label: prioridade,
            data: labels.map(dia => dadosAgrupados[dia]?.[prioridade] || 0)
        }));

        res.json({ labels, datasets });

    } catch (error) {
        console.error("Erro ao buscar chamados por dia e prioridade:", error.message);
        res.status(500).json({ error: "Erro ao buscar dados", detalhe: error.message });
    }
});

module.exports = router;