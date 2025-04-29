document.addEventListener('DOMContentLoaded', function () {
    const formulario = document.getElementById('formRegistro');

    formulario.addEventListener('submit', function (event) {
        event.preventDefault();

        const contrasena = document.getElementById('contrasena');
        const confirmarContrasena = document.getElementById('confirmarContrasena');
        const confirmarContrasenaTooltip = confirmarContrasena.nextElementSibling;

        // Verificar si las contraseñas coinciden
        if (contrasena.value !== confirmarContrasena.value) {
            confirmarContrasena.setCustomValidity('Las contraseñas no coinciden.'); // Establecer un mensaje de error personalizado
            confirmarContrasenaTooltip.textContent = 'Las contraseñas no coinciden.'; // Cambiar el mensaje del tooltip
            confirmarContrasena.classList.add('is-invalid'); // Agregar la clase de error
        } else {
            confirmarContrasena.setCustomValidity('');// Quitar el mensaje de error personalizado si las contraseñas coinciden
            confirmarContrasenaTooltip.textContent = 'Confirme su contraseña.'; // Mensaje por defecto del tooltip
            confirmarContrasena.classList.remove('is-invalid'); // Quitar la clase de error
        }

        if (formulario.checkValidity() === false) {
            formulario.classList.add('was-validated');
        } else {
            formulario.submit(); // Se envía el formulario si es válido
            alert(`Registro exitoso! \n Bienvenido`); // Aquí puedes agregar la lógica para enviar el formulario al servidor
        }
    });
});


document.addEventListener('DOMContentLoaded', function () {
    // Obtener el formulario de login
    let form = document.getElementById('loginForm');
    let emailInput = document.getElementById('txtEmail');
    let passwordInput = document.getElementById('idPassword');
    let loginError = document.getElementById('loginError');

    if (form && emailInput && passwordInput && loginError) {
        form.addEventListener('submit', function (e) {
            e.preventDefault(); // Prevenir el comportamiento por defecto

            let email = emailInput.value;
            let password = passwordInput.value;

            // Validación simple
            if (email === "itvo@voaxaca.tecnm.mx" && password === "123456") {
                // Si el login es exitoso, guardamos el estado en el almacenamiento
                sessionStorage.setItem("loggedIn", true);
                window.location.href = "/src/pages/inicio.html"; // Redirigir al inicio
            } else {
                loginError.classList.remove('d-none'); // Mostrar el error
            }
        });
    }
});