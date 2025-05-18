document.getElementById('registerForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const nombre = document.getElementById('nombre').value;
    const apellido = document.getElementById('apellido').value;
    const fecha_nacimiento = document.getElementById('fecha_nacimiento').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const IBAN = document.getElementById('iban').value;
    const direccion = document.getElementById('direccion').value;


    if (password !== confirmPassword) {
        alert('Las contraseñas no coinciden');
        return;
    }

    const newUser = {
        nombre: nombre,
        apellido: apellido,
        correo_electronico: email,
        fecha_nacimiento: fecha_nacimiento,
        contrasenya: password,
        IBAN: IBAN,
        direccion: direccion
    };

    try {
        const response = await fetch('http://localhost:8081/post/usuario', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newUser)
        });

        if (!response.ok) {
            const errorJson = await response.json();
            let errorMessage = "Registration failed: ";
            if (errorJson && errorJson.detail) {
                errorMessage += errorJson.detail;
            } else {
                errorMessage += `HTTP error! status: ${response.status}`;
            }
            throw new Error(errorMessage);
        }

        const responseData = await response.json();
        console.log('Registration successful:', responseData);
        alert('Registro exitoso! Por favor, inicia sesión.');
        window.location.href = '/html/inicio_sesion.html';


    } catch (error) {
        console.error('Error during registration:', error);
        alert('Error al registrar usuario: ' + error.message);
    }
});