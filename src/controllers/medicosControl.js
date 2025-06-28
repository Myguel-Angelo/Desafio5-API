const db = require('../config/mysqlConnect');

// GET /favoritos → retorna os médicos favoritos do usuário logado
exports.medicosFavoritos = async (req, res) => {
    const userId = req.userId;
    const query = `
        SELECT m.id, m.nome, m.email, m.telefone, m.crm, m.preco_consulta
        FROM favoritos f
        JOIN medicos m ON m.id = f.medico_id
        WHERE f.usuario_id = ?
    `;

    try {
        const [results] = await db.execute(query, [userId]);
        res.status(200).json(results);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// POST /favoritar/id:medicoId → adiciona um médico aos favoritos do usuário logado
exports.favoritarMedico = async (req, res) => {
    const userId = req.userId;
    const medicoId = parseInt(req.params.medicoId);

    try {
        if (isNaN(medicoId)) {
            return res.status(400).json({ erro: 'ID de médico inválido.' });
        }

        const checkQuery = `
            SELECT * FROM favoritos WHERE usuario_id = ? AND medico_id = ?
        `;

        const [results] = await db.execute(checkQuery, [userId, medicoId]);
        if (results.length > 0) return res.status(400).json({ mensagem: 'Este médico já está nos favoritos.' });

        const insertQuery = `
            INSERT INTO favoritos (usuario_id, medico_id) VALUES (?, ?)
        `;

        try {
            await db.execute(insertQuery, [userId, medicoId]);
            res.status(201).json({ mensagem: 'Médico favoritado com sucesso!' });
        } catch (err) {
            res.status(500).json({ erro: 'Erro ao favoritar médico.', error: err.message })
        }

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// // ROTA: GET /medicos/area/:id
// Descrição: Lista todos os médicos que pertencem a uma determinada área médica
exports.medicosAreas = async (req, res) => {
    const areaId = parseInt(req.params.areaId);

    if (isNaN(areaId)) {
        return res.status(400).json({ error: 'ID de área inválido.' });
    }

    const query = `
        SELECT m.id, m.nome, m.email, m.telefone, m.crm, m.preco_consulta
        FROM medico_areas ma
        JOIN medicos m ON m.id = ma.medico_id
        WHERE ma.area_id = ?
    `;

    try {
        const [results] = await db.execute(query, [areaId]);
        res.status(200).json(results);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao buscar médicos da área médica.', details: err.message });
    }
};


// // ROTA: GET /disponibilidade/:id
// Descrição: Lista todos os médicos que pertencem a uma determinada área médica
exports.disponibilidadeMedica = async (req, res) => {
    const medicoId = parseInt(req.params.medicoId);

    if (isNaN(medicoId)) {
        return res.status(400).json({ error: 'ID do médico inválido.' });
    }

    const query = `
        SELECT id, data, hora_inicio, hora_fim
        FROM disponibilidades
        WHERE medico_id = ? AND disponivel = 1
        ORDER BY data, hora_inicio
    `;

    try {
        const [results] = await db.execute(query, [medicoId]);
        res.status(200).json(results);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao buscar disponibilidade.', details: err.message });
    }
};
