document.addEventListener('DOMContentLoaded', function () {
    const formulario = document.getElementById('formRegistro');

    formulario.addEventListener('submit', function (event) {
        event.preventDefault();

        const contrasena = document.getElementById('contrasena');
        const confirmarContrasena = document.getElementById('confirmarContrasena');
        const confirmarContrasenaTooltip = confirmarContrasena.nextElementSibling; // Este es el tooltip del input

        // Verificar si las contraseñas coinciden
        if (contrasena.value !== confirmarContrasena.value) {
            confirmarContrasena.setCustomValidity('Las contraseñas no coinciden.');// Cambiar el mensaje de error
            confirmarContrasenaTooltip.textContent = 'Las contraseñas no coinciden.';// Cambiar el texto del tooltip para mostrar el nuevo mensaje
            confirmarContrasena.classList.add('is-invalid');// Agregar la clase de error para mostrar el mensaje visualmente
        } else {
            confirmarContrasena.setCustomValidity('');// Si las contraseñas coinciden, eliminar el mensaje de error    
            confirmarContrasenaTooltip.textContent = 'Confirme su contraseña.';// Restaurar el mensaje original del tooltip
            confirmarContrasena.classList.remove('is-invalid');// Eliminar la clase de error
        }

        if (formulario.checkValidity() === false) {
            formulario.classList.add('was-validated');
        } else {
            formulario.submit();
        }
    });
});