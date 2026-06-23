// check-db.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(path.join(__dirname, 'database.sqlite'));

db.all("SELECT id, email, created_at FROM usuarios", [], (err, rows) => {
    if (err) {
        console.error('Error:', err);
    } else {
        console.log(`\n📊 Total de usuarios: ${rows.length}\n`);
        rows.forEach(row => {
            console.log(`ID: ${row.id} | Email: ${row.email} | Creado: ${row.created_at}`);
        });
    }
    db.close();
});