document.addEventListener('DOMContentLoaded', function () {
    const formulario = document.getElementById('formRegistro');

    formulario.addEventListener('submit', function (event) {
        event.preventDefault();

        const contrasena = document.getElementById('contrasena');
        const confirmarContrasena = document.getElementById('confirmarContrasena');
        const confirmarContrasenaTooltip = confirmarContrasena.nextElementSibling; // Este es el tooltip del input

        // Verificar si las contraseñas coinciden
        if (contrasena.value !== confirmarContrasena.value) {
            // Cambiar el mensaje de error
            confirmarContrasena.setCustomValidity('Las contraseñas no coinciden.');

            // Cambiar el texto del tooltip para mostrar el nuevo mensaje
            confirmarContrasenaTooltip.textContent = 'Las contraseñas no coinciden.';

            // Agregar la clase de error para mostrar el mensaje visualmente
            confirmarContrasena.classList.add('is-invalid');
        } else {
            // Si las contraseñas coinciden, eliminar el mensaje de error
            confirmarContrasena.setCustomValidity('');

            // Restaurar el mensaje original del tooltip
            confirmarContrasenaTooltip.textContent = 'Confirme su contraseña.';

            // Eliminar la clase de error
            confirmarContrasena.classList.remove('is-invalid');
        }

        if (formulario.checkValidity() === false) {
            formulario.classList.add('was-validated');
        } else {
            // El formulario es válido, por lo que lo enviamos
            formulario.submit();
        }
    });
});
