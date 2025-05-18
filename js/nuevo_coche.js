document.getElementById('form-nuevo-coche').addEventListener('submit', async (e) => {
    e.preventDefault();

    const form = document.getElementById('form-nuevo-coche');
    const formData = new FormData(form);

    const jsonData = {};
    formData.forEach((value, key) => {
        if (['anio', 'kilometraje', 'precio', 'caballos', 'puertas', 'plazas'].includes(key)) {
            jsonData[key] = Number(value);
        } else {
            jsonData[key] = value;
        }
    });

    const userId = localStorage.getItem('userId');
    if (userId) {
        jsonData.id_usuario = Number(userId);
    } else {
        alert("No se encontró el ID del usuario. Asegúrate de haber iniciado sesión.");
        return;
    }

    try {
        const response = await fetch('http://localhost:8081/post/coche_detallado', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(jsonData)
        });

        const result = await response.json();

        if (result.status === 1) {
            alert('Coche añadido correctamente.');
            window.location.href = '/html/mis_anuncios.html';
        } else {
            alert('Error al guardar: ' + (result.message || 'Error desconocido'));
        }
    } catch (error) {
        console.error('Error al enviar los datos:', error);
        alert('Error al conectar con el servidor.');
    }
});