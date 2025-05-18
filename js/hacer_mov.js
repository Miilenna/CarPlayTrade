function mostrarMensaje(texto, tipo) {
    const mensajeDiv = document.getElementById('mensaje');
    if (!mensajeDiv) return;

    mensajeDiv.textContent = texto;
    mensajeDiv.className = tipo;
    mensajeDiv.style.display = 'block';
    setTimeout(() => {
        mensajeDiv.style.display = 'none';
    }, 5000);
}

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('movimientoForm');
    if (!form) {
        mostrarMensaje('No se encontró el formulario', 'error');
        return;
    }

    const userId = localStorage.getItem('userId');
    if (!userId) {
        mostrarMensaje('Debes iniciar sesión para realizar movimientos', 'error');
        setTimeout(() => {
            window.location.href = '/html/inicio_sesion.html';
        }, 2000);
        return;
    }

    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        const submitButton = form.querySelector('button[type="submit"]');
        if (!submitButton) return;

        const originalButtonText = submitButton.textContent;
        submitButton.textContent = 'Procesando...';
        submitButton.disabled = true;

        try {
            const formData = new FormData(form);
            const tipoMovimiento = formData.get('tipo_movimiento');

            if (tipoMovimiento !== 'entrada' && tipoMovimiento !== 'salida') {
                mostrarMensaje('Tipo de movimiento no válido', 'error');
                return;
            }

            const movimientoData = {
                tipo_movimiento: tipoMovimiento,
                id_usuario: parseInt(userId),
                divisa: formData.get('divisa'),
                valor: parseFloat(formData.get('valor')),
                region: formData.get('region') || 'España'
            };

            if (isNaN(movimientoData.valor) || movimientoData.valor <= 0) {
                mostrarMensaje('La cantidad debe ser un número positivo', 'error');
                return;
            }

            const response = await fetch('http://localhost:8081/post/movimiento', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(movimientoData)
            });

            const result = await response.json();

            if (result.status === 1) {
                mostrarMensaje('Movimiento realizado con éxito', 'success');
                form.reset();
            } else {
                mostrarMensaje(result.message || 'Error en el servidor', 'error');
            }
        } catch (error) {
            mostrarMensaje('Error de conexión: ' + error.message, 'error');
        } finally {
            submitButton.textContent = originalButtonText;
            submitButton.disabled = false;
        }
    });
});