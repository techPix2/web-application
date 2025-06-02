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
        res.status(500).json({ error: 'Erro ao buscar dados do Jira', detalhe: error.message });
    }
});
module.exports = router;