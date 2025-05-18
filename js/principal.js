document.addEventListener('DOMContentLoaded', function() {
    const marcaInput = document.getElementById('marca');
    const modeloInput = document.getElementById('modelo');
    const anioInput = document.getElementById('anio');
    const kilometrajeInput = document.getElementById('kilometraje');
    const combustibleInput = document.getElementById('combustible');
    const precioInput = document.getElementById('precio');
    const caballosInput = document.getElementById('caballos');
    const puertasInput = document.getElementById('puertas');
    const versionInput = document.getElementById('version');
    const plazasInput = document.getElementById('plazas');
    const resultadosInput = document.getElementById('resultados');
    const buscarCocheButton = document.getElementById('buscarCoche');
    const verResultadosButton = document.getElementById('verResultados');

    let cochesFiltrados = [];

    async function buscarCocheDetallado() {
        try {
            resultadosInput.value = 'Buscando coches...';

            const response = await fetch('http://localhost:8081/get/coches_detallados_inicio/');

            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }

            const todosLosCoches = await response.json();

            cochesFiltrados = todosLosCoches.filter(coche => {
                const cumpleFiltro =
                    (!marcaInput.value || coche.marca.toLowerCase().includes(marcaInput.value.toLowerCase())) &&
                    (!modeloInput.value || coche.modelo.toLowerCase().includes(modeloInput.value.toLowerCase())) &&
                    (!anioInput.value || coche.anio.toString() === anioInput.value) &&
                    (!kilometrajeInput.value || coche.kilometraje.toString() === kilometrajeInput.value) &&
                    (!combustibleInput.value || coche.combustible.toLowerCase().includes(combustibleInput.value.toLowerCase())) &&
                    (!precioInput.value || coche.precio.toString() === precioInput.value) &&
                    (!caballosInput.value || coche.caballos.toString() === caballosInput.value) &&
                    (!puertasInput.value || coche.puertas.toString() === puertasInput.value) &&
                    (!versionInput.value || (coche.version && coche.version.toLowerCase().includes(versionInput.value.toLowerCase()))) &&
                    (!plazasInput.value || coche.plazas.toString() === plazasInput.value);

                return cumpleFiltro;
            });

            if (cochesFiltrados.length === 0) {
                resultadosInput.value = 'No se encontraron coches';
            } else {
                resultadosInput.value = `Encontrados: ${cochesFiltrados.length} coches`;

                if (verResultadosButton) {
                    verResultadosButton.disabled = false;
                    verResultadosButton.textContent = `Ver ${cochesFiltrados.length} resultados`;
                }
            }

        } catch (error) {
            console.error('Error en la búsqueda:', error);
            resultadosInput.value = 'Error al buscar coches';

            if (verResultadosButton) {
                verResultadosButton.disabled = true;
            }
        }
    }

    function mostrarResultadosCompletos() {
        if (!cochesFiltrados || cochesFiltrados.length === 0) {
            alert('No hay resultados para mostrar. Realiza una búsqueda primero.');
            return;
        }

        try {
            sessionStorage.setItem('cochesFiltrados', JSON.stringify({
                timestamp: new Date().getTime(), // Para evitar cache
                data: cochesFiltrados
            }));

            window.location.href = 'resultados_coches.html';
        } catch (e) {
            console.error('Error al guardar resultados:', e);
            alert('No se pudieron guardar los resultados para mostrarlos');
        }
    }
    if (buscarCocheButton) {
        buscarCocheButton.addEventListener('click', buscarCocheDetallado);
    } else {
        console.error('Error: No se encontró el botón buscarCoche');
    }

    if (verResultadosButton) {
        verResultadosButton.disabled = true;
        verResultadosButton.addEventListener('click', mostrarResultadosCompletos);

        document.querySelectorAll('.filter input').forEach(input => {
            input.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    buscarCocheDetallado();
                }
            });
        });
    } else {
        console.error('Error: No se encontró el botón verResultados');
    }
});