const pg = require('pg');

const config = {
    host: 'dimdim-database.postgres.database.azure.com',
    user: 'wizzer@dimdim-database',
    password: '#!Azure#5',
    database: 'dimdim',
    port: 5432,
    ssl: true
};

const client = new pg.Pool(config);

function connect() {
    console.log('CONECTOU');
    client.connect(err => {
        if (err) throw err;
        else {
            queryDatabase();
        }
    });
}

function queryDatabase() {
    const query = `
    DROP TABLE IF EXISTS depositos;
    DROP TABLE IF EXISTS transacoes;
    DROP TABLE IF EXISTS usuarios;

    CREATE TABLE usuarios (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        saldo DECIMAL(10, 2) DEFAULT 0.00
    );

    CREATE TABLE depositos (
        id SERIAL PRIMARY KEY,
        usuario_id INT REFERENCES usuarios(id),
        valor DECIMAL(10, 2) NOT NULL,
        data TIMESTAMP DEFAULT NOW()
    );
    
    CREATE TABLE transacoes (
        id SERIAL PRIMARY KEY,
        remetente_id INT REFERENCES usuarios(id),
        destinatario_id INT REFERENCES usuarios(id),
        valor DECIMAL(10, 2) NOT NULL,
        data TIMESTAMP DEFAULT NOW()
    );
    `;

    client
        .query(query)
        .then(() => {
            console.log('Table created successfully!');
        })
        .catch(err => console.log(err))
        .then(() => {
            console.log('Finished execution, keep going!');
        });
}


module.exports = { client, connect };
