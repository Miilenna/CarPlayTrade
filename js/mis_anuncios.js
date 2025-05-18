document.addEventListener('DOMContentLoaded', function() {
    const userId = localStorage.getItem('userId');
    if (!userId) {
        window.location.href = '/html/inicio_sesion.html';
        return;
    }
    cargarCochesUsuario(userId);

    document.getElementById('cerrar_sesion').addEventListener('click', function() {
        localStorage.removeItem('userId');
        localStorage.removeItem('currentUser');
        window.location.href = '/html/principal.html';
    });
});

async function cargarCochesUsuario(usuario_id) {
    try {
        const response = await fetch(`http://localhost:8081/get/coches_usuario/${usuario_id}`);

        if (!response.ok) {
            throw new Error(response.status === 404 ?
                'No tienes coches anunciados' :
                'Error al cargar tus coches');
        }

        const coches = await response.json();
        console.log('Datos de coches recibidos:', coches);
        mostrarCoches(coches);
    } catch (error) {
        mostrarError(error.message);
    }
}

function generarNombreImagen(marca, modelo) {
    return `${marca.toLowerCase()}_${modelo.toLowerCase().replace(/\s+/g, '_')}.jpg`;
}

function mostrarCoches(cochesArrays) {
    const contenedor = document.getElementById('anuncios-info');
    contenedor.innerHTML = '<h2>Mis Coches Anunciados</h2>';

    if (!cochesArrays || cochesArrays.length === 0) {
        contenedor.innerHTML += `
            <div class="sin-coches">
                <p>No tienes ningún coche anunciado todavía.</p>
                <button id="nuevo-coche" class="btn">Añadir mi primer coche</button>
            </div>
        `;
        document.getElementById('nuevo-coche').addEventListener('click', () => {
            window.location.href = 'html/nuevo_coche.html';
        });
        return;
    }

    const listaCoches = document.createElement('div');
    listaCoches.className = 'lista-coches-grid';

    cochesArrays.forEach(cocheArray => {
        const coche = {
            id: cocheArray[0],
            marca: cocheArray[1],
            modelo: cocheArray[2],
            anio: cocheArray[3],
            kilometraje: cocheArray[4],
            combustible: cocheArray[5],
            precio: cocheArray[6],
            matricula: cocheArray[7],
            caballos: cocheArray[8],
            puertas: cocheArray[9],
            version: cocheArray[10],
            plazas: cocheArray[11]
        };

        const nombreImagen = generarNombreImagen(coche.marca, coche.modelo);
        const rutaImagen = `/img/${nombreImagen}`;

        const cocheItem = document.createElement('div');
        cocheItem.className = 'coche-item-estilizado';
        cocheItem.innerHTML = `
            <div class="imagen-coche-contenedor">
                <img src="${rutaImagen}" alt="${coche.marca} ${coche.modelo}" 
                     onerror="this.src='/img/coches/default_car.jpg'">
            </div>
            <div class="info-coche-estilizado">
                <div class="marca-modelo">
                    <h3>${coche.marca} ${coche.modelo}</h3>
                    <span class="version">${coche.version || ''}</span>
                </div>
                <div class="precio-ubicacion">
                    <span class="precio">${coche.precio}€</span>
                    <span class="ubicacion">Tel, España</span>
                </div>
                <div class="detalles">
                    <span>${coche.combustible}</span>
                    <span>${coche.kilometraje} km</span>
                    <span>${coche.puertas ? coche.puertas + ' puertas' : ''}</span>
                </div>
                <div class="acciones">
                    <button class="btn editar" data-id="${coche.id}">Editar</button>
                    <button class="btn eliminar" data-id="${coche.id}">Eliminar</button>
                </div>
            </div>
        `;
        listaCoches.appendChild(cocheItem);
    });

    contenedor.appendChild(listaCoches);

    const btnNuevoCoche = document.createElement('button');
    btnNuevoCoche.id = 'nuevo-coche';
    btnNuevoCoche.className = 'btn';
    btnNuevoCoche.textContent = 'Añadir nuevo coche';
    btnNuevoCoche.addEventListener('click', () => {
        window.location.href = '/html/nuevo_coche.html';
    });
    contenedor.appendChild(btnNuevoCoche);

    document.querySelectorAll('.editar').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const idCoche = e.target.getAttribute('data-id');
            window.location.href = `/html/editar_coche.html?id=${idCoche}`;
        });
    });

    document.querySelectorAll('.eliminar').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const idCoche = e.target.getAttribute('data-id');
            if (confirm('¿Estás seguro de eliminar este coche?')) {
                eliminarCoche(idCoche);
            }
        });
    });
}

async function eliminarCoche(idCoche) {
    try {
        const response = await fetch(`http://localhost:8081/delete/coche/${idCoche}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Error al eliminar el coche');
        }

        const userId = localStorage.getItem('userId');
        cargarCochesUsuario(userId);
    } catch (error) {
        mostrarError(error.message);
    }
}

function mostrarError(mensaje) {
    const contenedor = document.getElementById('anuncios-info');
    contenedor.innerHTML = `
        <div class="error">
            <p>${mensaje}</p>
            <button class="btn" onclick="location.reload()">Reintentar</button>
        </div>
    `;
}