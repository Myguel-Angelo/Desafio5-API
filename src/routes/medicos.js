const express = require('express');
const router = express.Router();
const { medicosFavoritos, favoritarMedico, medicosAreas, disponibilidadeMedica } = require('../controllers/medicosControl');
const authMiddleware = require('../middlewares/authMiddleware');

// ROTA: GET /medicos
// Descrição: Lista todos os médicos marcados como "favoritos"
router.get('/favoritos', authMiddleware, medicosFavoritos);

router.post('/favoritar/:medicoId', authMiddleware, favoritarMedico);

router.get('/disponibilidade/:medicoId', authMiddleware, disponibilidadeMedica);


// ROTA: GET /medicos/area/:id
// Descrição: Lista todos os médicos que pertencem a uma determinada área médica
router.get('/area/:areaId', authMiddleware, medicosAreas);

module.exports = router;
