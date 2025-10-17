import express from 'express';

const app = express();
const PORT = 5000;

app.get('/', (req, res) => {
  res.json({ 
    message: '🚀 Server is UP!',
    status: '✅ Running',
    port: PORT
  });
});

app.listen(PORT, () => {
  console.log(`\n⚡ Server running on http://localhost:${PORT}\n`);
});