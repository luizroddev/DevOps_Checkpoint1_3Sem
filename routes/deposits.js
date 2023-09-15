var express = require('express');
const { client } = require('../database/postgresql');
var router = express.Router();

// Rota para listar todos os depósitos
router.get('/', async (req, res) => {
    try {
        const query = 'SELECT * FROM depositos';
        const result = await client.query(query);
        res.json(result.rows);
    } catch (error) {
        console.error('Erro ao listar depósitos:', error);
        res.status(500).json({ error: 'Erro ao listar depósitos' });
    }
});

// Rota para listar todos os depósitos de um usuário específico
router.get('/:usuario_id', async (req, res) => {
    try {
        const { usuario_id } = req.params;
        const query = 'SELECT * FROM depositos WHERE usuario_id = $1';
        const result = await client.query(query, [usuario_id]);
        res.json(result.rows);
    } catch (error) {
        console.error('Erro ao listar depósitos:', error);
        res.status(500).json({ error: 'Erro ao listar depósitos' });
    }
});

// Rota para criar um depósito em uma conta
router.post('/', async (req, res) => {
    try {
        const { usuario_id, valor } = req.body;

        // Verifique se o usuário existe
        const usuarioExistenteQuery = 'SELECT * FROM usuarios WHERE id = $1';
        const usuarioExiste = await client.query(usuarioExistenteQuery, [usuario_id]);

        if (usuarioExiste.rows.length !== 1) {
            return res.status(400).json({ error: 'Usuário não encontrado' });
        }

        // Atualize o saldo do usuário
        const atualizarSaldoQuery = 'UPDATE usuarios SET saldo = saldo + $1 WHERE id = $2';
        await client.query(atualizarSaldoQuery, [valor, usuario_id]);

        // Crie o depósito
        const depositoQuery = 'INSERT INTO depositos (usuario_id, valor) VALUES ($1, $2) RETURNING *';
        const result = await client.query(depositoQuery, [usuario_id, valor]);

        res.json({ message: 'Depósito criado com sucesso', deposito: result.rows[0] });
    } catch (error) {
        console.error('Erro ao criar depósito:', error);
        res.status(500).json({ error: 'Erro ao criar depósito' });
    }
});

module.exports = router;
