document.addEventListener('DOMContentLoaded', async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
        alert("No se encontró el ID de usuario. Por favor inicia sesión.");
        return;
    }
    try {
        const response = await fetch(`http://localhost:8081/get/perfil/${userId}`);
        if (!response.ok) throw new Error('Error al obtener datos del perfil');
        const perfil = await response.json();

        document.getElementById('nombre').value = perfil.nombre || perfil[0] || '';
        document.getElementById('apellido').value = perfil.apellido || perfil[1] || '';
        document.getElementById('fecha_nacimiento').value = perfil.fecha_nacimiento || perfil[3] || '';
        document.getElementById('IBAN').value = perfil.IBAN || perfil[5] || '';
        document.getElementById('direccion').value = perfil.direccion || perfil[7] || '';
        console.log(perfil);
    } catch (error) {
        console.error(error);
        alert("No se pudieron cargar los datos del perfil.");
    }
});

document.getElementById('perfil-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem('userId');
    if (!userId) {
        alert("No se encontró el ID de usuario. Por favor inicia sesión.");
        return;
    }

    const form = e.target;
    const perfilData = {
        nombre: form.nombre.value || null,
        apellido: form.apellido.value || null,
        fecha_nacimiento: form.fecha_nacimiento.value || null,
        IBAN: form.IBAN.value || null,
        direccion: form.direccion.value || null,
    };

    try {
        const response = await fetch(`http://localhost:8081/put/perfil/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(perfilData),
        });

        const result = await response.json();
        if (response.ok) {
            alert("Perfil actualizado correctamente.");
            window.location.href = 'perfil.html'
        } else {
            alert("Error al actualizar perfil: " + (result.detail || result.message));
        }
    } catch (error) {
        console.error("Error al actualizar perfil:", error);
        alert("Error de conexión con el servidor.");
    }
});