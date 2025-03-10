document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Aquí puedes agregar la lógica para validar el inicio de sesión
    console.log('Correo electrónico:', email);
    console.log('Contraseña:', password);

    // Ejemplo de validación simple
    if (email === "usuario@example.com" && password === "contraseña") {
        alert('Inicio de sesión exitoso');
    } else {
        alert('Correo electrónico o contraseña incorrectos');
    }
});