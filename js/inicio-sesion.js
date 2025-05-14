document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Codifica el email para URLs
    const encodedEmail = encodeURIComponent(email);
    
    try {
        const response = await fetch(`http://localhost:8081/get/usuarios/${encodedEmail}`);

        // Verifica si la respuesta es correcta
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        
        const userData = await response.json();

        // Verifica si los datos del usuario están presentes y si la contraseña coincide
        if (userData && userData.contrasenya === password) {
            localStorage.setItem('currentUser', JSON.stringify(userData));
            window.location.href = '/CarPlayTrade/html/perfil.html';
        } else {
            alert('Credenciales incorrectas');
        }
    } catch (error) {
        console.error('Error en el inicio de sesión:', error);
        alert('Error al iniciar sesión. Verifica la consola para más detalles.');
    }
});
