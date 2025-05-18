document.addEventListener("DOMContentLoaded", function() {
    fetch('../html/header.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('header').innerHTML = data;

            const userId = localStorage.getItem('userId');
            const loginLink = document.getElementById('loginLink');
            const profileLink = document.getElementById('profileLink');
            const logoutLink = document.getElementById('logoutLink');

            if (userId) {
                if (loginLink) loginLink.style.display = 'none';
                if (profileLink) profileLink.style.display = 'inline-block';
                if (logoutLink) logoutLink.style.display = 'inline-block';

                logoutLink.addEventListener('click', function(e) {
                    e.preventDefault();
                    localStorage.removeItem('userId');
                    localStorage.removeItem('userEmail');
                    localStorage.removeItem('userName');
                    window.location.href = '/html/inicio_sesion.html';
                });
            } else {
                if (loginLink) loginLink.style.display = 'inline-block';
                if (profileLink) profileLink.style.display = 'none';
                if (logoutLink) logoutLink.style.display = 'none';
            }
        })
        .catch(error => {
            console.error('Error al cargar el header:', error);
        });

    const protectedPages = ['perfil.html', 'editar_perfil.html', 'configuracion.html'];
    const currentPage = window.location.pathname.split('/').pop();

    if (protectedPages.includes(currentPage)) {
        const userId = localStorage.getItem('userId');
        if (!userId) {
            alert('Debes iniciar sesión para acceder a esta página');
            window.location.href = '/html/inicio_sesion.html';
        }
    }

    document.addEventListener('DOMContentLoaded', function() {
        const userId = localStorage.getItem('userId');
        const loginLink = document.getElementById('loginLink');
        const profileLink = document.getElementById('profileLink');
        const logoutLink = document.getElementById('logoutLink');

        if (userId) {
            loginLink.style.display = 'none';
            profileLink.style.display = 'inline-block';
            logoutLink.style.display = 'inline-block';

            logoutLink.addEventListener('click', function(e) {
                e.preventDefault();
                localStorage.removeItem('userId');
                localStorage.removeItem('currentUser');
                window.location.href = '/html/principal.html';
            });
        } else {
            profileLink.style.display = 'none';
            logoutLink.style.display = 'none';
        }
    });
});