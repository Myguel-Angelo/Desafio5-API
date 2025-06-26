const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.registrar = async (req, res) => {
  const { nome, email, senha, telefone, data_nascimento } = req.body;

  db.get('SELECT * FROM usuarios WHERE email = ?', [email], async (err, row) => {
    if (row) return res.status(400).json({ mensagem: 'Email já cadastrado' });

    const senhaHash = await bcrypt.hash(senha, 10);
    const createdAt = new Date().toISOString();

    const sql = `
      INSERT INTO usuarios (nome, email, senha_hash, telefone, data_nascimento, created_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.run(sql, [nome, email, senhaHash, telefone, data_nascimento, createdAt], function (err) {
      if (err) return res.status(500).json({ mensagem: 'Erro ao registrar usuário', erro: err.message });
      res.status(201).json({ id: this.lastID, mensagem: 'Usuário registrado com sucesso' });
    });
  });
};

exports.login = (req, res) => {
  const { email, senha } = req.body;

  db.get('SELECT * FROM usuarios WHERE email = ?', [email], async (err, usuario) => {
    if (!usuario) return res.status(404).json({ mensagem: 'Usuário não encontrado' });

    const senhaCorreta = await bcrypt.compare(senha, usuario.senha_hash);
    if (!senhaCorreta) return res.status(401).json({ mensagem: 'Senha incorreta' });

    const token = jwt.sign({ id: usuario.id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token });
  });
};

exports.pegarUsuarioLogado = (req, res) => {
  const userId = req.userId;
  

  db.get('SELECT id, nome, email, telefone, data_nascimento, created_at FROM usuarios WHERE id = ?', [userId], (err, usuario) => {
    if (!usuario) return res.status(404).json({ mensagem: 'Usuário não encontrado' });
    res.json(usuario);
  });
};
