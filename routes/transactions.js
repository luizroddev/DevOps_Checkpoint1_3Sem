var express = require('express');
const { client } = require('../database/postgresql');
var router = express.Router();

// Rota para listar todas as transações
router.get('/', async (req, res) => {
    try {
        const query = 'SELECT * FROM transacoes';
        const result = await client.query(query);
        res.json(result.rows);
    } catch (error) {
        console.error('Erro ao listar transações:', error);
        res.status(500).json({ error: 'Erro ao listar transações' });
    }
});

// Rota para listar todas as transações de um usuário específico
router.get('/:usuario_id', async (req, res) => {
    try {
        const { usuario_id } = req.params;
        const query = 'SELECT * FROM transacoes WHERE usuario_id = $1';
        const result = await client.query(query, [usuario_id]);
        res.json(result.rows);
    } catch (error) {
        console.error('Erro ao listar transações:', error);
        res.status(500).json({ error: 'Erro ao listar transações' });
    }
});

// Rota para criar uma transação entre usuários
router.post('/', async (req, res) => {
    try {
        let { remetente_id, destinatario_id, valor } = req.body;
        valor = Number(valor)

        // Verifique se o remetente e o destinatário existem
        const usuariosExistentesQuery = 'SELECT * FROM usuarios WHERE id = $1 OR id = $2';
        const usuariosExistentes = await client.query(usuariosExistentesQuery, [remetente_id, destinatario_id]);

        if (usuariosExistentes.rows.length !== 2) {
            return res.status(400).json({ error: 'Remetente ou destinatário não encontrado' });
        }

        // Verifique se o remetente tem saldo suficiente
        const saldoRemetenteQuery = 'SELECT saldo FROM usuarios WHERE id = $1';
        const saldoRemetenteResult = await client.query(saldoRemetenteQuery, [remetente_id]);
        const saldoRemetente = saldoRemetenteResult.rows[0].saldo;

        if (saldoRemetente < valor) {
            return res.status(400).json({ error: 'Saldo insuficiente' });
        }

        // Inicie a transação
        await client.query('BEGIN');

        // Deduza o valor do remetente
        const deducaoRemetenteQuery = 'UPDATE usuarios SET saldo = saldo - $1 WHERE id = $2';
        await client.query(deducaoRemetenteQuery, [valor, remetente_id]);

        // Adicione o valor ao destinatário
        const adicaoDestinatarioQuery = 'UPDATE usuarios SET saldo = saldo + $1 WHERE id = $2';
        await client.query(adicaoDestinatarioQuery, [valor, destinatario_id]);

        // Registre a transação
        const transacaoQuery = 'INSERT INTO transacoes (remetente_id, destinatario_id, valor) VALUES ($1, $2, $3) RETURNING *';
        const transacaoResult = await client.query(transacaoQuery, [remetente_id, destinatario_id, valor]);

        // Confirme a transação
        await client.query('COMMIT');

        res.json({ message: 'Transação concluída com sucesso', transacao: transacaoResult.rows[0] });
    } catch (error) {
        console.error('Erro ao criar transação entre usuários:', error);
        // Em caso de erro, reverta a transação
        await client.query('ROLLBACK');
        res.status(500).json({ error: 'Erro ao criar transação entre usuários' });
    }
});

module.exports = router;