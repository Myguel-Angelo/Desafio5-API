const express = require('express');
const router = express.Router();
const usuarioControl = require('../controllers/usuarioControl');
const authMiddleware = require('../middlewares/authMiddleware');

// Rota de cadastro
router.get('/game', usuarioControl.listarUsuarios);

router.post('/auth/register', usuarioControl.registrar);

// Rota de login
router.post('/auth/login', usuarioControl.login);

// Rota protegida para pegar dados do usuário logado
router.get('/me', authMiddleware, usuarioControl.pegarUsuarioLogado);


router.put('/atualizar', authMiddleware, usuarioControl.atualizarUsuario);


module.exports = router;
