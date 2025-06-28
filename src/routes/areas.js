const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const db = require('../config/mysqlConnect');

// ROTA: GET /areas
// Descrição: Lista todas as áreas médicas
router.get('/', authMiddleware, async (req, res) => {
    const query = `SELECT id, nome FROM areas_medicas ORDER BY nome ASC`;

    try {
        const [results] = await db.execute(query);
        res.status(200).json(results);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao buscar áreas médicas.', details: err.message });
    }
});

module.exports = router;
