
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
