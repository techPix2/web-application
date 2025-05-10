const axios = require('axios');

const JIRA_DOMAIN = 'seu-dominio.atlassian.net';
const JIRA_USER = 'seu-email@exemplo.com';
const JIRA_API_TOKEN = 'seu-token-de-api';
const JQL_QUERY = 'status = "In Progress"';

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