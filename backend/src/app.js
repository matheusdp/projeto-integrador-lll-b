require('dotenv').config();
const express = require('express');
const app = express();

app.use(express.json());

// Rotas
app.use('/auth', require('./routes/auth.routes'));
app.use('/projects', require('./routes/project.routes'));
app.use('/tasks', require('./routes/task.routes'));

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Task Manager API' });
});

// Tratamento de erros global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Erro interno do servidor'
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

module.exports = app;
