document.addEventListener('DOMContentLoaded', function() {
    const resultadosContainer = document.getElementById('resultados-container');
    const filtroMarca = document.getElementById('filtro-marca');
    const filtroModelo = document.getElementById('filtro-modelo');
    const filtroAnio = document.getElementById('filtro-anio');
    const filtroCombustible = document.getElementById('filtro-combustible');
    const btnAplicarFiltros = document.getElementById('btn-aplicar-filtros');

    async function cargarCoches() {
        let storedData = sessionStorage.getItem('cochesFiltrados');
        if (storedData) {
            const coches = JSON.parse(storedData).data || [];

            coches.forEach(coche => {
                if (!coche.id) {
                    console.warn('Coche sin id (sessionStorage):', coche);
                    coche.id = Math.random().toString(36).substring(2, 9);
                }
            });

            return coches;
        } else {
            try {
                const response = await fetch('/get/coches');
                if (!response.ok) throw new Error('Error al cargar los coches');
                const data = await response.json();

                if (!data.data || !Array.isArray(data.data)) {
                    throw new Error('Formato de datos inválido');
                }

                data.data.forEach(coche => {
                    if (!coche.id) {
                        console.warn('Coche sin id (backend):', coche);
                        coche.id = Math.random().toString(36).substring(2, 9);
                    }
                });

                sessionStorage.setItem('cochesFiltrados', JSON.stringify(data));
                return data.data || [];
            } catch (error) {
                console.error('Error cargando coches:', error);
                mostrarError('Error al cargar los coches. Por favor, recarga la página.');
                return [];
            }
        }
    }

    function mostrarError(mensaje) {
        resultadosContainer.innerHTML = `
            <div class="error-message">
                <p>${mensaje}</p>
                <button onclick="window.location.reload()">Recargar página</button>
            </div>
        `;
    }

    function generarNombreImagen(marca, modelo) {
        const safeMarca = marca.toLowerCase().replace(/\s+/g, '_').replace(/[^\w-]/g, '');
        const safeModelo = modelo.toLowerCase().replace(/\s+/g, '_').replace(/[^\w-]/g, '');
        return `/img/${safeMarca}_${safeModelo}.jpg`;
    }

    function mostrarResultados(listaCoches) {
        resultadosActuales = [...listaCoches];

        if (!listaCoches.length) {
            resultadosContainer.innerHTML = '<p class="no-resultados">No hay resultados disponibles</p>';
            return;
        }

        const fragment = document.createDocumentFragment();
        const heading = document.createElement('h2');
        heading.textContent = `Resultados de Búsqueda (${listaCoches.length})`;
        fragment.appendChild(heading);

        const container = document.createElement('div');
        container.className = 'resultados-grid';

        listaCoches.forEach(coche => {
            console.log('Renderizando coche:', coche); // Depuración

            const card = document.createElement('div');
            card.className = 'coche-card';

            const rutaImagen = coche.imagen_url || generarNombreImagen(coche.marca, coche.modelo);

            card.innerHTML = `
                <div class="imagen-coche-contenedor">
                    <img src="${rutaImagen}" alt="${coche.marca} ${coche.modelo}" 
                        onerror="this.onerror=null;this.src='/img/coches/default_car.jpg'">
                </div>
                <div class="coche-info">
                    <h3>${coche.marca} ${coche.modelo}</h3>
                    <p><strong>Año:</strong> ${coche.anio}</p>
                    <p><strong>Precio:</strong> ${coche.precio} €</p>
                    <p><strong>Kilometraje:</strong> ${coche.kilometraje} km</p>
                    <p><strong>Combustible:</strong> ${coche.combustible}</p>
                    ${coche.version ? `<p><strong>Versión:</strong> ${coche.version}</p>` : ''}
                    <div class="boton-ver-anuncio-contenedor">
                        <button class="ver-anuncio-btn" data-id="${coche.id}">Ver anuncio</button>
                    </div>
                </div>
            `;

            container.appendChild(card);
        });

        fragment.appendChild(container);
        resultadosContainer.innerHTML = '';
        resultadosContainer.appendChild(fragment);
    }

    function renderizarCoches() {
        const resultados = document.getElementById("resultados");
        resultados.innerHTML = "";

        const coches = JSON.parse(sessionStorage.getItem("coches")) || [];

        coches.forEach(coche => {
            console.log("Renderizando coche:", coche);
            if (!coche.id) {
                console.warn("Coche sin ID:", coche);
            }

            card.innerHTML = `
            <div class="imagen-coche-contenedor">
                <img src="${rutaImagen}" alt="${coche.marca} ${coche.modelo}" 
                    onerror="this.onerror=null;this.src='/img/coches/default_car.jpg'">
            </div>
            <div class="coche-info">
                <h3>${coche.marca} ${coche.modelo}</h3>
                ${coche.id ? `<p><strong>ID:</strong> ${coche.id}</p>` : ''}
                <p><strong>Año:</strong> ${coche.anio}</p>
                <p><strong>Precio:</strong> ${coche.precio} €</p>
                <p><strong>Kilometraje:</strong> ${coche.kilometraje} km</p>
                <p><strong>Combustible:</strong> ${coche.combustible}</p>
                ${coche.version ? `<p><strong>Versión:</strong> ${coche.version}</p>` : ''}
                <div class="boton-ver-anuncio-contenedor">
                    <button class="ver-anuncio-btn" data-id="${coche.id}">Ver anuncio</button>
                </div>
            </div>
    `;

            resultados.innerHTML += cocheHTML;
        });
    }

    function aplicarFiltros(coches) {
        const marca = filtroMarca.value.trim().toLowerCase();
        const modelo = filtroModelo.value.trim().toLowerCase();
        const anio = filtroAnio.value.trim();
        const combustible = filtroCombustible.value.trim().toLowerCase();

        const filtrados = coches.filter(coche => {
            const cocheMarca = coche.marca?.toLowerCase() || '';
            const cocheModelo = coche.modelo?.toLowerCase() || '';
            const cocheCombustible = coche.combustible?.toLowerCase() || '';

            return (!marca || cocheMarca.includes(marca)) &&
                (!modelo || cocheModelo.includes(modelo)) &&
                (!anio || coche.anio?.toString() === anio) &&
                (!combustible || cocheCombustible.includes(combustible));
        });

        mostrarResultados(filtrados);
    }

    cargarCoches().then(coches => {
        if (coches.length === 0) {
            mostrarError('No se encontraron coches disponibles.');
            return;
        }

        mostrarResultados(coches);

        btnAplicarFiltros.addEventListener('click', () => aplicarFiltros(coches));

        document.addEventListener('click', async function(e) {
            if (e.target.classList.contains('ver-anuncio-btn')) {
                e.preventDefault();
                const id = e.target.getAttribute('data-id');

                if (!id) {
                    mostrarError('Error: El coche seleccionado no tiene identificador válido.');
                    return;
                }

                e.target.disabled = true;
                e.target.textContent = 'Cargando...';

                try {
                    const response = await fetch(`/get/coche/det/${id}`);
                    if (!response.ok) {
                        throw new Error(`Error ${response.status}: ${response.statusText}`);
                    }

                    const coche = await response.json();

                    if (!coche || Object.keys(coche).length === 0) {
                        throw new Error('No se encontraron datos del coche');
                    }

                    sessionStorage.setItem('cocheSeleccionado', JSON.stringify(coche));
                    window.location.href = 'html/anuncio_individual.html';
                } catch (error) {
                    console.error('Error al cargar el anuncio:', error);
                    mostrarError('Error al cargar el anuncio. Por favor, inténtelo de nuevo.');
                    e.target.disabled = false;
                    e.target.textContent = 'Ver anuncio';
                }
            }
        });
    });
});