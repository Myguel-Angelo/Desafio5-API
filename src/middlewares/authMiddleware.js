const jwt = require('jsonwebtoken');
require('dotenv').config();

function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) return res.status(401).json({ mensagem: 'Token não fornecido' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    console.log(`Usuário autenticado: ${req.userId}`);
    next();
  } catch (err) {
    res.status(401).json({ mensagem: 'Token inválido' });
  }
}

module.exports = authMiddleware;
