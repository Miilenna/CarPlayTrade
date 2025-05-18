document.addEventListener('DOMContentLoaded', async function() {
    try {
        const id = localStorage.getItem('userId');

        if (!id) {
            console.error('User ID not found in local storage.');
            alert('No se ha encontrado la información del usuario. Por favor, inicia sesión de nuevo.');
            window.location.href = '/html/inicio_sesion.html';
            return;
        }

        const response = await fetch(`http://localhost:8081/get/perfil/${id}`);

        if (!response.ok) {
            const errorBody = await response.json();
            const errorMessage = errorBody.detail || `Error HTTP: ${response.status}`;
            console.error('Error fetching user profile:', errorMessage);
            alert(`Error al cargar el perfil: ${errorMessage}`);
            return;
        }

        const userData = await response.json();
        console.log("userData (RAW):", JSON.stringify(userData, null, 2));
        console.log("userData (OBJECT):", userData);

        if (userData) {
            document.getElementById('nombrePerfil').textContent = userData[0] || 'No disponible';
            document.getElementById('apellidoPerfil').textContent = userData[1] || 'No disponible';
            document.getElementById('emailPerfil').textContent = userData[2] || 'No disponible';
            document.getElementById('fechaPerfil').textContent = userData[3] || 'No disponible';
            document.getElementById('ibanPerfil').textContent = userData[5] || 'No disponible';
            document.getElementById('direccionPerfil').textContent = userData[7] || 'No disponible';

        } else {
            console.error('Datos del perfil no encontrados en la respuesta.');
            alert('No se encontraron los datos del perfil.');
        }
    } catch (error) {
        console.error('Error fetching user profile:', error);
        alert('Error inesperado al cargar el perfil: ' + error.message);
    }
});

document.getElementById('cerrar_sesion').addEventListener('click', function() {
    localStorage.removeItem('userId');
    window.location.href = '/html/inicio_sesion.html';
});

document.getElementById('editar_perfil').addEventListener('click', function() {
    window.location.href = '/html/editar_perfil.html';
});
