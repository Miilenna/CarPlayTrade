document.addEventListener('DOMContentLoaded', async function () {
    const id = localStorage.getItem('userId');

    if (!id) {
        alert('No se ha encontrado la información del usuario. Por favor, inicia sesión.');
        window.location.href = '/html/inicio_sesion.html';
        return;
    }

    try {
        const response = await fetch(`http://localhost:8081/get/saldo/${id}`);
        if (!response.ok) throw new Error('No se pudo obtener el saldo');

        const saldo = await response.json();
        document.getElementById('cartera').textContent = saldo + ' €';
    } catch (err) {
        console.error('Error:', err);
        alert('No se pudo cargar el saldo. Intenta de nuevo más tarde.');
    }
});

document.getElementById('cerrar_sesion').addEventListener('click', function () {
    localStorage.removeItem('userId');
    window.location.href = '/html/inicio_sesion.html';
});
