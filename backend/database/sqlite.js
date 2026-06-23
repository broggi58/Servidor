const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DB_PATH = path.join(__dirname, '../database.sqlite');

// Crear conexión
const db = new sqlite3.Database(DB_PATH);

// Promise wrapper para usar async/await
db.runAsync = (sql, params = []) => {
    return new Promise((resolve, reject) => {
        db.run(sql, params, function (err) {
            if (err) reject(err);
            resolve({ id: this.lastID, changes: this.changes });
        });
    });
};

db.getAsync = (sql, params = []) => {
    return new Promise((resolve, reject) => {
        db.get(sql, params, (err, row) => {
            if (err) reject(err);
            resolve(row);
        });
    });
};

db.allAsync = (sql, params = []) => {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) reject(err);
            resolve(rows);
        });
    });
};

// Inicializar tablas
async function initDatabase() {
    const createTableSQL = `
        CREATE TABLE IF NOT EXISTS usuarios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `;

    await db.runAsync(createTableSQL);
    console.log('Base de datos SQLite inicializada');
}

module.exports = { db, initDatabase, dbAsync: db };