document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const idCoche = params.get('id');

    if (!idCoche) {
        alert('ID de coche no encontrado.');
        window.location.href = '/html/mis_anuncios.html';
        return;
    }

    try {
        const response = await fetch(`http://localhost:8081/get/coche/${idCoche}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const coche = await response.json();

        document.getElementById('marca').value = coche.marca || coche[2] || '';
        document.getElementById('modelo').value = coche.modelo || coche[3] || '';
        document.getElementById('anio').value = coche.anio || coche[4] || '';
        document.getElementById('kilometraje').value = coche.kilometraje || coche[5] || '';
        document.getElementById('combustible').value = coche.combustible || coche[6] || '';
        document.getElementById('precio').value = coche.precio || coche[7] || '';
        document.getElementById('matricula').value = coche.matricula || coche[8] || '';
        document.getElementById('caballos').value = coche.caballos || coche[9] || '';
        document.getElementById('puertas').value = coche.puertas || coche[10] || '';
        document.getElementById('version').value = coche.version || coche[11] || '';
        document.getElementById('plazas').value = coche.plazas || coche[12] || '';

        if (coche.imagen) {
            document.getElementById('imagen-preview').src = `http://localhost:8081/images/${coche.imagen}`;
            document.getElementById('eliminar-imagen').style.display = 'block';
        }

    } catch (error) {
        console.error('Error cargando el coche:', error);
        alert('Error al cargar los datos del coche. Por favor, inténtelo de nuevo.');
    }

    const imageInput = document.getElementById('imagen');
    const imagenPreview = document.getElementById('imagen-preview');
    const btnEliminarImagen = document.getElementById('eliminar-imagen');

    imageInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                imagenPreview.src = event.target.result;
                btnEliminarImagen.style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    });

    btnEliminarImagen.addEventListener('click', function() {
        imagenPreview.src = '/img/default-car.png';
        imageInput.value = '';
        btnEliminarImagen.style.display = 'none';
    });

    document.getElementById('form-editar-coche').addEventListener('submit', async (e) => {
        e.preventDefault();

        const data = {
            id_usuario: localStorage.getItem('userId'),
            marca: document.getElementById('marca').value,
            modelo: document.getElementById('modelo').value,
            anio: parseInt(document.getElementById('anio').value),
            kilometraje: parseInt(document.getElementById('kilometraje').value),
            combustible: document.getElementById('combustible').value,
            precio: parseFloat(document.getElementById('precio').value),
            matricula: document.getElementById('matricula').value,
            caballos: parseInt(document.getElementById('caballos').value),
            puertas: parseInt(document.getElementById('puertas').value),
            version: document.getElementById('version').value,
            plazas: parseInt(document.getElementById('plazas').value),
        };

        try {
            const response = await fetch(`http://localhost:8081/put/coche_detallado/${idCoche}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                alert('Coche actualizado correctamente');
                window.location.href = '/html/mis_anuncios.html';
            } else {
                const errorText = await response.text();
                console.error("Error del servidor:", errorText);
                alert('Error al actualizar el coche: ' + (errorText || 'Error desconocido'));
            }
        } catch (error) {
            console.error('Error al guardar:', error);
            alert('Error de conexión. Por favor, inténtelo de nuevo.');
        }
    });
});