require('dotenv').config();
const express = require('express');
const router = express.Router();
const axios = require('axios');


router.get('/jira-kpis', async (req, res) => {
     const filtro = req.query.filtro;

    try {
        let jql;
        if (filtro === 'status') {
            jql = process.env.JQL_QUERY;
        } else if (filtro === 'dia') {
            jql = process.env.JQL_DIA;
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

        const totalChamados = response.data.total;
        const chamadosEmAndamento = response.data.issues.length;

        res.json({ totalChamados, chamadosEmAndamento});
    } catch (error) {
        // Printar variáveis de ambiente usadas
        console.error('JIRA_DOMAIN:', process.env.JIRA_DOMAIN);
        console.error('JIRA_USER:', process.env.JIRA_USER);
        console.error('JIRA_API_TOKEN:', process.env.JIRA_API_TOKEN ? '***' : 'NÃO DEFINIDO');
        console.error('JQL_QUERY:', process.env.JQL_QUERY);

        // Printar detalhes do erro do axios
        if (error.response) {
            // Erro de resposta do Jira (ex: 401, 403, 404, 500)
            console.error('Status:', error.response.status);
            console.error('Headers:', error.response.headers);
            console.error('Data:', error.response.data);
        } else if (error.request) {
            // Erro de conexão (sem resposta)
            console.error('Request:', error.request);
        } else {
            // Outro erro (ex: erro de código)
            console.error('Error:', error.message);
        }
        // Stack trace
        console.error('Stack:', error.stack);

        res.status(500).json({ error: 'Erro ao buscar dados do Jira', detalhe: error.message });
    }
});

module.exports = router;