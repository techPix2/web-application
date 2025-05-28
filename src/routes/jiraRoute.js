const express = require('express');
const router = express.Router();
const axios = require('axios');
require('dotenv').config();

router.get('/jira-kpis', async (req, res) => {
  try {
    const auth = Buffer.from(`${process.env.JIRA_USER}:${process.env.JIRA_API_TOKEN}`).toString('base64');
    const url = `https://${process.env.JIRA_DOMAIN}/rest/api/2/search?jql=${encodeURIComponent(process.env.JQL_QUERY)}&maxResults=100`;

    const response = await axios.get(url, {
      headers: {
        'Authorization': `Basic ${auth}`,
        'Accept': 'application/json'
      }
    });

    const totalChamados = response.data.total;
    const chamadosEmAndamento = response.data.issues.length;

    res.json({ totalChamados, chamadosEmAndamento });
  } catch (error) {
    console.error('Erro detalhado Jira:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Erro ao buscar dados do Jira' });
  }
});

module.exports = router;