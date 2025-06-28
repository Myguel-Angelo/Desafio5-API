const db = require('../config/mysqlConnect')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();


// controlador para registrar usuário
exports.registrar = async (req, res) => {
  const { nome, email, senha, telefone, data_nascimento } = req.body;

  try {
    const [rows] = await db.execute('SELECT * FROM usuarios WHERE email = ?', [email])
    if (rows.length > 0) return res.status(400).json({ mensagem: 'Email já cadastrado' });

    const senhaHash = await bcrypt.hash(senha, 10);

    const sql = `
      INSERT INTO usuarios (nome, email, senha, telefone, data_nascimento)
      VALUES (?, ?, ?, ?, ?)
    `;

    try {
      const [results] = await db.execute(sql, [nome, email, senhaHash, telefone, data_nascimento]);
      res.status(201).json({ id: results.insertId, mensagem: 'Usuário registrado com sucesso' });
    } catch (err) {
      res.status(500).json({ mensagem: 'Erro ao registrar usuário', erro: err.message });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }

};

exports.login = async (req, res) => {
  const { email, senha } = req.body;

  try {
    const [rows] = await db.execute('SELECT * FROM usuarios WHERE email = ?', [email])
    if (rows.length === 0) return res.status(404).json({ mensagem: 'Usuário não encontrado' });

    const usuario = rows[0]
    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
    if (!senhaCorreta) return res.status(401).json({ mensagem: 'Senha incorreta' });

    const token = jwt.sign({ id: usuario.id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.pegarUsuarioLogado = async (req, res) => {
  const userId = req.userId;

  try {
    const [rows] = await db.execute('SELECT id, nome, email, telefone, data_nascimento FROM usuarios WHERE id = ?', [userId])
    if (rows.length === 0) return res.status(404).json({ mensagem: 'Usuário não encontrado' });

    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.atualizarUsuario = async (req, res) => {
  const userId = req.userId;
  const { nome, email, cpf } = req.body;

  if (!nome || !email || !cpf) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios: nome, email e cpf.' });
  }

  const query = `
        UPDATE usuarios
        SET nome = ?, email = ?, cpf = ?
        WHERE id = ?
    `;

  try {
    await db.execute(query, [nome, email, cpf, userId]);
    res.status(200).json({ mensagem: 'Usuário atualizado com sucesso.' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao atualizar usuário.', details: err.message });
  }
};