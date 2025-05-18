document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const encodedEmail = encodeURIComponent(email);

    try {
        const response = await fetch(`http://localhost:8081/get/usuarios/${encodedEmail}`);

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const userData = await response.json();

        if (userData && userData.contrasenya === password) {
            localStorage.setItem('userId', userData.id); 
            localStorage.setItem('currentUser', JSON.stringify(userData));
            window.location.href = '/html/perfil.html';
        } else {
            alert('Credenciales incorrectas');
        }
    } catch (error) {
        console.error('Error en el inicio de sesión:', error);
        alert('Error al iniciar sesión. Verifica la consola para más detalles.');
    }
});