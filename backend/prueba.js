// prueba.js (crea este archivo en tu carpeta backend)
const fs = require('fs').promises;
const path = require('path');

async function test() {
    const testPath = path.join(__dirname, 'test.txt');
    console.log('Intentando escribir en:', testPath);
    try {
        await fs.writeFile(testPath, 'Hola mundo', 'utf8');
        console.log('Archivo creado exitosamente');
        const content = await fs.readFile(testPath, 'utf8');
        console.log('Contenido:', content);
    } catch (error) {
        console.error(' Error:', error);
    }
}

test();