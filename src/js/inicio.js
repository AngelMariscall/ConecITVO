document.addEventListener('DOMContentLoaded', function () {
    // Verificar si el usuario está logueado
    if (sessionStorage.getItem("loggedIn") !== "true") {
        // Si no está logueado, redirigir a login
        window.location.href = "/src/index.html";
    } else {
        // Si está logueado, no hacer nada, solo mostrar la página de inicio
        console.log("Sesión iniciada");
    }

    // Delegación de eventos: escuchamos el clic en el menú desplegable
    document.querySelector(".dropdown-menu").addEventListener("click", function (event) {
        if (event.target && event.target.id === "logoutBtn") {
            event.preventDefault(); // Evita que el navegador siga el # y recargue la página

            // Eliminar la sesión
            sessionStorage.removeItem("loggedIn");

            // Redirigir a la página de login
            window.location.href = "/src/index.html"; // Redirigir al login
        }
    });
});
