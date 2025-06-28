require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

const usuarioRoutes = require('./routes/usuarios');
const medicoRoutes = require('./routes/medicos');
const areasRoutes = require('./routes/areas');

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('API rodando! Use /usuarios para acessar os usuários.');
});

app.use('/api/usuarios', usuarioRoutes);
app.use('/api/medicos', medicoRoutes);
app.use('/api/areas', areasRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
