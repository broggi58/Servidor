// Este archivo decide qué base de datos usar según .env
//const DB_TYPE = process.env.DB_TYPE || 'json';
const DB_TYPE = 'sqlite';
let db;
if (DB_TYPE === 'sqlite') {
    db = require('./dbStorage');
    console.log('Usando SQLite como base de datos');
} else {
    db = require('./fileStorage');
    console.log('Usando JSON como almacenamiento');
}

module.exports = db;