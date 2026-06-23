const { db, initDatabase } = require('../database/sqlite');

// Inicializar BD al importar
initDatabase().catch(console.error);

async function findUserByEmail(email) {
    const sql = 'SELECT * FROM usuarios WHERE email = ?';
    return await db.getAsync(sql, [email]);
}

async function createUser(userData) {
    const { email, password_hash, created_at } = userData;
    const sql = `
        INSERT INTO usuarios (email, password_hash, created_at)
        VALUES (?, ?, ?)
    `;
    const result = await db.runAsync(sql, [email, password_hash, created_at || new Date().toISOString()]);

    return {
        id: result.id,
        email,
        password_hash,
        created_at: created_at || new Date().toISOString()
    };
}

async function getAllUsers() {
    const sql = 'SELECT id, email, created_at FROM usuarios';
    return await db.allAsync(sql);
}

async function updateUser(id, userData) {
    const { email, password_hash } = userData;
    const sql = `
        UPDATE usuarios 
        SET email = ?, password_hash = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
    `;
    await db.runAsync(sql, [email, password_hash, id]);
    return { id, ...userData };
}

async function deleteUser(id) {
    const sql = 'DELETE FROM usuarios WHERE id = ?';
    await db.runAsync(sql, [id]);
    return { id };
}

module.exports = {
    findUserByEmail,
    createUser,
    getAllUsers,
    updateUser,
    deleteUser
};