require('dotenv').config();

const JIRA_DOMAIN = process.env.JIRA_DOMAIN;
const JIRA_USER = process.env.JIRA_USER;
const JIRA_API_TOKEN = process.env.JIRA_API_TOKEN;
const JQL_QUERY = process.env.JQL_QUERY;

const axios = require('axios');

// Configurações do Jira

const auth = Buffer.from(`${JIRA_USER}:${JIRA_API_TOKEN}`).toString('base64');

const config = {
  method: 'get',
  url: `https://${JIRA_DOMAIN}/rest/api/2/search?jql=${encodeURIComponent(JQL_QUERY)}&maxResults=100`,
  headers: {
    'Authorization': `Basic ${auth}`,
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
};

axios(config)
  .then(response => {
    console.log('Chamados em andamento:');
    response.data.issues.forEach(issue => {
      console.log(`- ${issue.key}: ${issue.fields.summary}`);
    });
    console.log(`Total: ${response.data.total} chamados`);
  })
  .catch(error => {
    console.error('Erro ao buscar chamados:', error.response ? error.response.data : error.message);
  });