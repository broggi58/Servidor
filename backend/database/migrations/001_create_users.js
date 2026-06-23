const fs = require('fs').promises;
const path = require('path');
const { initDatabase, db } = require('../sqlite');

async function migrateData() {
    console.log('Iniciando migración de datos...');

    // 1. Inicializar BD
    await initDatabase();

    // 2. Leer datos del JSON
    const jsonPath = path.join(__dirname, '../../utils/usuarios.json');
    try {
        const data = await fs.readFile(jsonPath, 'utf8');
        const { usuarios } = JSON.parse(data);

        console.log(`Encontrados ${usuarios.length} usuarios en JSON`);

        // 3. Insertar en SQLite
        for (const user of usuarios) {
            const sql = `
                INSERT OR IGNORE INTO usuarios (email, password_hash, created_at)
                VALUES (?, ?, ?)
            `;
            await db.runAsync(sql, [user.email, user.password_hash, user.created_at]);
            console.log(`Migrado: ${user.email}`);
        }

        console.log('Migración completada exitosamente!');

        // 4. Verificar datos migrados
        const count = await db.getAsync('SELECT COUNT(*) as total FROM usuarios');
        console.log(`Total en SQLite: ${count.total} usuarios`);

    } catch (error) {
        console.error('Error en migración:', error);
    }
}

migrateData();