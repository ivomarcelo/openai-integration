require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { OpenAI } = require('openai');

const app = express();
const port = process.env.PORT || 5000;

// Configuração do OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Middlewares
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

// Rota de teste
app.get('/', (req, res) => {
  res.json({ message: 'Backend para integração com OpenAI' });
});

// Rota para interagir com a OpenAI
app.post('/api/ask', async (req, res) => {
  try {
    const { prompt, model = 'gpt-3.5-turbo', max_tokens = 150 } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt é obrigatório' });
    }

    const completion = await openai.chat.completions.create({
      model,
      messages: [{ role: 'user', content: prompt }],
      max_tokens: parseInt(max_tokens),
    });

    res.json({
      response: completion.choices[0].message.content,
      usage: completion.usage,
    });
  } catch (error) {
    console.error('Erro ao chamar OpenAI:', error);
    res.status(500).json({ error: 'Erro ao processar sua solicitação' });
  }
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});