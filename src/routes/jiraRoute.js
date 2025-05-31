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
            if (!start || !end) {
                return res.status(400).json({ error: 'Parâmetros "start" e "end" são obrigatórios para o filtro por dia.' });
            }
            jql = `created >= "${start}" AND created <= "${end}"`;
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
        const totalChamados = issues.length;
        let chamadosEmAndamento = 0;
        let resolvidos = 0;
        let somaTempos = 0;

        issues.forEach(issue => {
            const created = new Date(issue.fields.created);
            const resolved = issue.fields.resolutiondate ? new Date(issue.fields.resolutiondate) : null;

            if (!resolved) {
                chamadosEmAndamento++;
            } else {
                resolvidos++;
                somaTempos += (resolved - created);
            }
        });

        let tempoMedioResolucao = null;
        if (resolvidos > 0) {
        const mediaMs = somaTempos / resolvidos;
        const mediaMin = mediaMs / (1000 * 60);
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
        const url = `https://${process.env.JIRA_DOMAIN}/rest/api/2/search?jql=${encodeURIComponent(jql)}&maxResults=100`;

        const response = await axios.get(url, {
            headers: {
                'Authorization': `Basic ${auth}`,
                'Accept': 'application/json'
            }
        });

        const issues = response.data.issues;

        const funcionarios = {};

        for (const issue of issues) {
            const fields = issue.fields || {};
            const responsavel = fields.assignee?.displayName || "Sem responsável";
            const status = fields.status?.name || "Indefinido";

            if (!funcionarios[responsavel]) {
                funcionarios[responsavel] = { nome: responsavel, recebidos: 0, realizados: 0, atrasados: 0 };
            }

            funcionarios[responsavel].recebidos++;

            if (status.toLowerCase() === 'done' || status.toLowerCase() === 'concluída') {
                funcionarios[responsavel].realizados++;
            }

            const created = new Date(fields.created);
            const hoje = new Date();
            const dias = (hoje - created) / (1000 * 60 * 60 * 24);
            if (dias > 1 && status.toLowerCase() !== 'done') {
                funcionarios[responsavel].atrasados++;
            }
        }

        res.json(Object.values(funcionarios));
    } catch (error) {
        console.error("Erro ao buscar dados dos funcionários:", error);

        if (error.response) {
            console.error("Status:", error.response.status);
            console.error("Data:", error.response.data);
        }

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