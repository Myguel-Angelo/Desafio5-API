const express = require('express');
const cors = require('cors');
const app = express();

const usuarioRoutes = require('./routes/usuarios');

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API rodando! Use /usuarios para acessar os usuários.');
});

app.use('/usuarios', usuarioRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
