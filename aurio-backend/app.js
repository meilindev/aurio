import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('aurio backend is running');
});

app.post('/api/tools', async (req, res) => {
  const { tool, input } = req.body;

  let prompt = '';
  if (tool === 'task-breaker') {
    prompt = `Break down the task "${input}" into clear, numbered steps. Use simple language.`;
  } else {
    return res.status(400).json({ error: 'Unknown tool' });
  }

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.5,
      }),
    });

    const data = await response.json();
    const result = data.choices[0].message.content;
    res.json({ result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'AI service error' });
  }
});

app.listen(port, () => {
  console.log(`aurio backend listening on port ${port}`);
});
