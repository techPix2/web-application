const express = require('express');
const router = express.Router();
const { WebClient } = require('@slack/web-api');
require('dotenv').config();

const web = new WebClient(process.env.SLACK_BOT_TOKEN);
const channelId = "C08RST7LY1H";

//buscar mensagens
router.get('/mensagens', async (req, res) => {
  try {
    const now = Math.floor(Date.now() / 1000);
    const yesterday = now - 24 * 60 * 60; 
    const result = await web.conversations.history({
      channel: channelId,
      limit: 100,
      oldest: yesterday
    });
    res.json(result.messages.reverse());
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar mensagens do Slack' });
  }
});

//enviar mensagem
router.post('/mensagens', async (req, res) => {
  const { text } = req.body;
  try {
    const result = await web.chat.postMessage({ channel: channelId, text });
    res.json({ ok: result.ok, ts: result.ts });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao enviar mensagem ao Slack' });
  }
});

module.exports = router;
