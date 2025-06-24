const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(path.resolve(__dirname, '../../database/database.sqlite'), (err) => {
    if (err) return console.error('Erro ao conectar no banco:', err.message);
    console.log('🗂️  Conectado ao banco SQLite3');
});

module.exports = db;
