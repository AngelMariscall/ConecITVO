// Este archivo solo se ejecutará en inicio.html

document.addEventListener('DOMContentLoaded', function () {
    // Verificar si el usuario está logueado
    if (sessionStorage.getItem("loggedIn") !== "true") {
        // Si no está logueado, redirigir a login
        window.location.href = "/src/index.html";
    }

    // Función para cerrar sesión
    document.getElementById("logoutBtn")?.addEventListener("click", function (event) {
        event.preventDefault(); // Evita que el navegador siga el # y recargue la página

        // Eliminar la sesión
        sessionStorage.removeItem("loggedIn");

        // Redirigir a la página de login
        window.location.href = "/src/index.html"; // Redirigir al login
    });
});
