const axios = require('axios');

// Configurações
const JIRA_DOMAIN = 'seu-dominio.atlassian.net'; // Substitua pelo seu domínio JIRA
const PROJECT_KEY = 'TEC'; // Substitua pela chave do projeto
const JIRA_EMAIL = 'seu-email@exemplo.com'; // Seu e-mail de acesso ao JIRA
const JIRA_API_TOKEN = 'seu-token-api'; // Token de API gerado no Atlassian

// URL da API do JIRA
const url = `https://${JIRA_DOMAIN}/rest/api/2/issue`;

// Dados da issue (payload JSON)
const issueData = {
  fields: {
    project: {
      key: PROJECT_KEY,
    },
    summary: 'Título do chamado (Exemplo via Node.js)',
    description: 'Descrição detalhada do problema...',
    issuetype: {
      name: 'Task', // Pode ser 'Bug', 'Story', etc.
    },
  },
};

// Configuração do Axios
const config = {
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Basic ${Buffer.from(`${JIRA_EMAIL}:${JIRA_API_TOKEN}`).toString('base64')}`,
  },
};

// Requisição POST para criar a issue
axios
  .post(url, issueData, config)
  .then((response) => {
    console.log('Issue criada com sucesso!');
    console.log('ID:', response.data.id);
    console.log('Key:', response.data.key);
    console.log('URL:', response.data.self);
  })
  .catch((error) => {
    console.error('Erro ao criar a issue:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Resposta:', error.response.data);
    } else {
      console.error('Erro desconhecido:', error.message);
    }
  });