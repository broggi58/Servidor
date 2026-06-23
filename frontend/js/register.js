// js/register.js
console.log('Script cargado');

const API_URL = 'http://localhost:3000'; // Ajusta según tu backend

document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    console.log('Formulario enviado');
    const email = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const messageDiv = document.getElementById('message');
    const hasUpper = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showMessage('Ingrese un email válido', 'error');
        return;
    }

    console.log('Datos:', { username, password: '***' });
    
    if (password.length < 8 || !hasNumber || !hasUpper) {
        showMessage('La contraseña debe tener al menos 8 caracteres', 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        showMessage('Las contraseñas no coinciden', 'error');
        return;
    }
    
    try {
         console.log(' Enviando petición a:', `${API_URL}/auth/register`);
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password })
        });
        
        console.log('Respuesta recibida, status:', response.status);

        const data = await response.json();

        console.log('Datos:', data);

        if (response.ok) {
            showMessage('¡Registro exitoso! Redirigiendo al login...', 'success');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
        } else {
            showMessage(data.error || 'Error en el registro', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showMessage('Error de conexión con el servidor', 'error');
    }
});

function showMessage(msg, type) {
    const messageDiv = document.getElementById('message');
    messageDiv.textContent = msg;
    messageDiv.className = type;
    setTimeout(() => {
        messageDiv.textContent = '';
        messageDiv.className = '';
    }, 3000);
}