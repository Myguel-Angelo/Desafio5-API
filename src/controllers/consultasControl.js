const db = require('../config/mysqlConnect')

exports.criarAgendamento = async (req, res) => {
    const usuarioId = req.userId;
    const { medico_id, disponibilidade_id } = req.body;

    if (!medico_id || !disponibilidade_id) {
        return res.status(400).json({ error: 'Campos obrigatórios: medico_id e disponibilidade_id' });
    }

    // Verifica se a disponibilidade está livre
    const [disponibilidadeCheck] = await db.execute(
        'SELECT * FROM disponibilidades WHERE id = ? AND medico_id = ? AND disponivel = 1',
        [disponibilidade_id, medico_id]
    );

    if (disponibilidadeCheck.length === 0) {
        return res.status(400).json({ error: 'Horário não disponível para este médico.' });
    }

    // Marca como agendada (disponivel = 0)
    await db.execute(
        'UPDATE disponibilidades SET disponivel = 0 WHERE id = ?',
        [disponibilidade_id]
    );

    // Insere o agendamento
    const query = `
        INSERT INTO agendamentos (usuario_id, medico_id, disponibilidade_id, status, criado_em)
        VALUES (?, ?, ?, 'agendado', NOW())
    `;

    try {
        await db.execute(query, [usuarioId, medico_id, disponibilidade_id]);
        res.status(201).json({ mensagem: 'Consulta agendada com sucesso!' });
    } catch (err) {
        res.status(500).json({ error: 'Erro ao agendar consulta.', details: err.message });
    }
};



exports.listarAgendamentos = async (req, res) => {
    const usuarioId = req.userId;

    const query = `
        SELECT 
        a.id AS agendamento_id,
        m.nome AS medico_nome,
        am.nome AS especialidade,
        d.data,
        d.hora_inicio AS hora,
        a.status,
        m.preco_consulta
        FROM agendamentos a
        JOIN medicos m ON m.id = a.medico_id
        JOIN medico_areas ma ON ma.medico_id = m.id
        JOIN areas_medicas am ON am.id = ma.area_id
        JOIN disponibilidades d ON d.id = a.disponibilidade_id
        WHERE a.usuario_id = ?
        ORDER BY d.data ASC, d.hora_inicio ASC
    `;

    try {
        const [rows] = await db.execute(query, [usuarioId]);
        res.status(200).json(rows);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao buscar consultas.', details: err.message });
    }
};


exports.cancelarAgendamento = async (req, res) => {
    const usuarioId = req.userId;
    const agendamentoId = parseInt(req.params.id);

    if (isNaN(agendamentoId)) {
        return res.status(400).json({ error: 'ID de agendamento inválido.' });
    }

    try {
        // Busca o agendamento e confirma que pertence ao usuário
        const [rows] = await db.execute(
            `SELECT * FROM agendamentos WHERE id = ? AND usuario_id = ?`,
            [agendamentoId, usuarioId]
        );

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Agendamento não encontrado.' });
        }

        const agendamento = rows[0];

        // Reativa a disponibilidade
        await db.execute(
            `UPDATE disponibilidades SET disponivel = 1 WHERE id = ?`,
            [agendamento.disponibilidade_id]
        );

        // Remove o agendamento
        await db.execute(
            `DELETE FROM agendamentos WHERE id = ?`,
            [agendamentoId]
        );

        res.status(200).json({ mensagem: 'Consulta desmarcada com sucesso.' });

    } catch (err) {
        res.status(500).json({ error: 'Erro ao desmarcar consulta.', details: err.message });
    }
};
