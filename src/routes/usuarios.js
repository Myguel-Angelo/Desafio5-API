
const express = require('express');
const router = express.Router();
const controller = require('../controllers/usuarioControl');

router.get('/', controller.listarUsuarios);

module.exports = router;
