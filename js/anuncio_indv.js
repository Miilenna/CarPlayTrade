        document.addEventListener('DOMContentLoaded', function() {
            const cocheContent = document.getElementById('coche-content');
            
            try {
                const cocheData = JSON.parse(sessionStorage.getItem('cocheSeleccionado'));
                
                if (!cocheData) {
                    throw new Error('No se encontraron datos del coche');
                }
                
                cocheContent.innerHTML = `
                    <img src="${cocheData.imagen_url}" alt="${cocheData.marca} ${cocheData.modelo}" 
                         class="imagen-principal" onerror="this.src='/img/coches/default_car.jpg'">
                    <div class="info-coche">
                        <h1>${cocheData.marca} ${cocheData.modelo}</h1>
                        <p class="precio">${cocheData.precio} €</p>
                        <p><strong>Año:</strong> ${cocheData.anio}</p>
                        <p><strong>Kilometraje:</strong> ${cocheData.kilometraje} km</p>
                        <p><strong>Combustible:</strong> ${cocheData.combustible}</p>
                        <p><strong>Matrícula:</strong> ${cocheData.matricula}</p>
                        ${cocheData.puertas ? `<p><strong>Puertas:</strong> ${cocheData.puertas}</p>` : ''}
                        ${cocheData.plazas ? `<p><strong>Plazas:</strong> ${cocheData.plazas}</p>` : ''}
                        ${cocheData.version ? `<p><strong>Versión:</strong> ${cocheData.version}</p>` : ''}
                        ${cocheData.descripcion ? `<p><strong>Descripción:</strong> ${cocheData.descripcion}</p>` : ''}
                    </div>
                `;
            } catch (error) {
                console.error('Error al cargar el anuncio:', error);
                cocheContent.innerHTML = `
                    <div class="error">
                        <p>No se pudo cargar la información del coche.</p>
                        <p>${error.message}</p>
                        <button onclick="window.location.href='index.html'">Volver al inicio</button>
                    </div>
                `;
            }
        });