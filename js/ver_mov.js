document.addEventListener('DOMContentLoaded', async function() {
    const id_usuario = localStorage.getItem('id_usuario');
    if (!id_usuario) {
        window.location.href = '/inicio_sesion.html';
        return;
    }
    const listaMovimientos = document.getElementById('lista-movimientos');
    const filtroTipo = document.getElementById('filtro-tipo');
    const filtroDivisa = document.getElementById('filtro-divisa');
    const balanceTotal = document.getElementById('balance-total');
    const totalEntradas = document.getElementById('total-entradas');
    const totalSalidas = document.getElementById('total-salidas');
    let movimientos = [];

    async function cargarMovimientos() {
        try {
            listaMovimientos.innerHTML = '<div class="sin-movimientos"><p>Cargando tus movimientos...</p></div>';

            const apiUrl = `http://127.0.0.1:8081/get/movimiento/${id_usuario}`;
            console.log('Fetching data from:', apiUrl); // Para debug

            const response = await fetch(apiUrl, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }

            movimientos = await response.json();
            console.log('Movimientos recibidos:', movimientos);

            actualizarLista();
            actualizarResumen();

        } catch (error) {
            console.error('Error al cargar movimientos:', error);
            listaMovimientos.innerHTML = `
                <div class="sin-movimientos">
                    <p>Error al cargar movimientos: ${error.message}</p>
                    <button onclick="window.cargarMovimientos()">Reintentar</button>
                </div>
            `;
        }
    }

    window.cargarMovimientos = cargarMovimientos;

    function actualizarLista() {
        const tipo = filtroTipo.value;
        const divisa = filtroDivisa.value;

        const movimientosFiltrados = movimientos.filter(mov => {
            return (tipo === 'todos' || mov.tipo_movimiento === tipo) &&
                (divisa === 'todos' || mov.divisa === divisa);
        });

        if (movimientosFiltrados.length === 0) {
            listaMovimientos.innerHTML = '<div class="sin-movimientos"><p>No hay movimientos que coincidan con los filtros</p></div>';
            return;
        }

        listaMovimientos.innerHTML = '';

        movimientosFiltrados.forEach(mov => {
            const movimientoItem = document.createElement('div');
            movimientoItem.className = 'movimiento-item';

            movimientoItem.innerHTML = `
                <div class="movimiento-info">
                    <div class="movimiento-tipo ${mov.tipo_movimiento}">
                        ${mov.tipo_movimiento === 'entrada' ? 'Ingreso' : 'Retirada'}
                    </div>
                    <div class="movimiento-fecha">${mov.fecha_formateada}</div>
                    ${mov.region ? `<div class="movimiento-region">${mov.region}</div>` : ''}
                </div>
                <div class="movimiento-valor">
                    ${mov.tipo_movimiento === 'entrada' ? '+' : '-'}${mov.valor.toFixed(2)}
                    <span class="movimiento-divisa">${mov.divisa}</span>
                </div>
            `;

            listaMovimientos.appendChild(movimientoItem);
        });
    }

    function actualizarResumen() {
        let entradas = 0;
        let salidas = 0;

        movimientos.forEach(mov => {
            if (mov.divisa === 'EUR') {
                if (mov.tipo_movimiento === 'entrada') {
                    entradas += mov.valor;
                } else {
                    salidas += mov.valor;
                }
            }
        });

        const balance = entradas - salidas;

        balanceTotal.textContent = `${balance.toFixed(2)} €`;
        totalEntradas.textContent = `${entradas.toFixed(2)} €`;
        totalSalidas.textContent = `${salidas.toFixed(2)} €`;
    }

    filtroTipo.addEventListener('change', actualizarLista);
    filtroDivisa.addEventListener('change', actualizarLista);

    cargarMovimientos();
});