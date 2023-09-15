var express = require('express');
const { client } = require('../database/postgresql');
var router = express.Router();

// Rota para criar um usuário com um saldo padrão
router.post('/', async (req, res) => {
    try {
        let { nome, email, saldo } = req.body;
        saldo = Number(saldo)

        // Verifique se o usuário já existe pelo email
        const usuarioExistenteQuery = 'SELECT * FROM usuarios WHERE email = $1';
        const usuarioExistente = await client.query(usuarioExistenteQuery, [email]);

        if (usuarioExistente.rows.length > 0) {
            return res.status(400).json({ error: 'O usuário já existe com este email' });
        }

        // Crie o usuário
        const criarUsuarioQuery = 'INSERT INTO usuarios (nome, email, saldo) VALUES ($1, $2, $3) RETURNING *';
        const result = await client.query(criarUsuarioQuery, [nome, email, saldo]);

        res.status(201).json({ message: 'Usuário criado com sucesso', usuario: result.rows[0] });
    } catch (error) {
        console.error('Erro ao criar usuário:', error);
        res.status(500).json({ error: 'Erro ao criar usuário' });
    }
});

// Rota para listar todos os usuários
router.get('/', async (req, res) => {
    try {
        const query = 'SELECT * FROM usuarios';
        const result = await client.query(query);
        res.json(result.rows);
    } catch (error) {
        console.error('Erro ao listar usuários:', error);
        res.status(500).json({ error: 'Erro ao listar usuários' });
    }
});

module.exports = router;
