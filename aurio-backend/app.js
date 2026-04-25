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
  } else if (tool === 'email-fixer') { // Keep for future expansion
    prompt = `Rewrite this email to be more polite and professional: ${input}`;
  } else if (tool === 'time-guess') { // Keep for future expansion
    prompt = `Estimate how many hours this task will take: ${input}`;
  } else if (tool === 'note-cleaner') { // Keep for future expansion
    prompt = `Turn these messy notes into clean, organized bullet points: ${input}`;
  } else {
    return res.status(400).json({ error: 'Unknown tool' });
  }

  try {
    // --- DeepSeek specific configuration ---
    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`, // Use DEEPSEEK_API_KEY
      },
      body: JSON.stringify({
        model: 'deepseek-chat', // Use a valid DeepSeek model, check their docs for the latest
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.5,
      }),
    });
    // --- End of DeepSeek specific configuration ---

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