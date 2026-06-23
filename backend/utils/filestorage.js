// utils/fileStorage.js
const fs = require('fs').promises;
const path = require('path');

const FILE_PATH = path.join(__dirname, 'usuarios.json');

console.log(' FILE_PATH configurado en:', FILE_PATH);

async function readUsers() {
    console.log(' Leyendo usuarios de:', FILE_PATH);
    try {
        const data = await fs.readFile(FILE_PATH, 'utf8');
        console.log(' Archivo leído exitosamente');
        return JSON.parse(data);
    } catch (error) {
        console.log(' Error leyendo archivo:', error.code);
        if (error.code === 'ENOENT') {
            console.log('Archivo no existe, creando uno nuevo...');
            const initialData = { usuarios: [] };
            await writeUsers(initialData);
            console.log(' Archivo inicial creado en:', FILE_PATH);
            return initialData;
        }
        console.error(' Error inesperado:', error);
        throw error;
    }
}

async function writeUsers(data) {
    console.log('Escribiendo en archivo:', FILE_PATH);
    console.log('Datos a guardar:', JSON.stringify(data, null, 2).substring(0, 200));
    try {
        const jsonString = JSON.stringify(data, null, 2);
        await fs.writeFile(FILE_PATH, jsonString, 'utf8');
        console.log('Archivo escrito exitosamente');

        // Verificar que realmente se creó
        const stats = await fs.stat(FILE_PATH);
        console.log('Tamaño del archivo:', stats.size, 'bytes');
    } catch (error) {
        console.error('ERROR ESCRITURA:', error);
        throw error;
    }
}

// Resto del código igual...
async function findUserByEmail(email) {
    const data = await readUsers();
    return data.usuarios.find(u => u.email === email);
}

async function createUser(userData) {
    const data = await readUsers();
    const newUser = {
        id: data.usuarios.length + 1,
        ...userData,
        created_at: new Date().toISOString()
    };
    data.usuarios.push(newUser);
    await writeUsers(data);
    return newUser;
}

module.exports = { readUsers, writeUsers, findUserByEmail, createUser };