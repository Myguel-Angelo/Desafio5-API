const express = require('express');
const router = express.Router();
const consultasControl = require('../controllers/consultasControl');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/', authMiddleware, consultasControl.listarAgendamentos)

router.post('/agendar', authMiddleware, consultasControl.criarAgendamento);

router.delete('/del/:id', authMiddleware, consultasControl.cancelarAgendamento);


module.exports = router