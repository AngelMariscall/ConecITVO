// contribucion.js
import botones from './buttons.js';

document.addEventListener('DOMContentLoaded', function () {
    if (sessionStorage.getItem("loggedIn") !== "true") { // Verificar si el usuario está logueado
        // Si no está logueado, redirigir a login
        window.location.href = "/src/index.html";
    }

    ocultarTablaContribuciones();

    // Delegación de eventos en la tabla
    document.getElementById('tablaContribuciones').addEventListener('click', event => {
        const id = event.target.id;
        const fila = event.target.closest('tr');
        if (!fila) return;

        // --- EDITAR ---
        if (id === botones.botones.btnEditar.id) {
            const celdas = fila.querySelectorAll('td');
            window._datosOriginales = [];
            celdas.forEach((td, i) => {
                if (i === celdas.length - 1) return;
                window._datosOriginales.push(td.textContent);
                const inp = document.createElement('input');
                inp.value = td.textContent;
                inp.className = 'form-control';
                td.textContent = '';
                td.appendChild(inp);
            });
            botones.ChangeButtonEvent(
                event,
                botones.botones.btnGuardar.id,
                botones.botones.btnGuardar.ruta,
                botones.botones.btnGuardar.title
            );
            botones.botonSinEvento(
                fila.querySelector(`#${botones.botones.btnEliminar.id}`),
                botones.botones.btnCancelar.id,
                botones.botones.btnCancelar.ruta,
                botones.botones.btnCancelar.title
            );
            return;
        }

        // --- GUARDAR ---
        if (id === botones.botones.btnGuardar.id) {
            fila.querySelectorAll('td').forEach((td, i) => {
                if (i === fila.children.length - 1) return;
                const inp = td.querySelector('input');
                td.textContent = inp.value;
            });
            botones.ChangeButtonEvent(
                event,
                botones.botones.btnEditar.id,
                botones.botones.btnEditar.ruta,
                botones.botones.btnEditar.title
            );
            botones.botonSinEvento(
                fila.querySelector(`#${botones.botones.btnCancelar.id}`),
                botones.botones.btnEliminar.id,
                botones.botones.btnEliminar.ruta,
                botones.botones.btnEliminar.title
            );
            return;
        }

        // --- CANCELAR ---
        if (id === botones.botones.btnCancelar.id) {
            fila.querySelectorAll('td').forEach((td, i) => {
                if (i === fila.children.length - 1) return;
                td.textContent = window._datosOriginales[i];
            });
            botones.ChangeButtonEvent(
                event,
                botones.botones.btnEliminar.id,
                botones.botones.btnEliminar.ruta,
                botones.botones.btnEliminar.title
            );
            botones.botonSinEvento(
                fila.querySelector(`#${botones.botones.btnGuardar.id}`),
                botones.botones.btnEditar.id,
                botones.botones.btnEditar.ruta,
                botones.botones.btnEditar.title
            );
            return;
        }

        // --- ELIMINAR ---
        if (id === botones.botones.btnEliminar.id) {
            fila.remove();
            if (document.querySelectorAll('#tablaContribuciones tr').length === 0) {
                ocultarTablaContribuciones();
            }
        }
    });

    // Envío de formulario
    document.getElementById('formContribucion').addEventListener('submit', event => {
        event.preventDefault();
        const form = event.target;
        if (!form.checkValidity()) {
            form.classList.add('was-validated');
            return;
        }
        const fd = new FormData(form);
        agregarFila(fd);
        form.reset();
        form.classList.remove('was-validated');
        mostrarTablaContribuciones();
    });
}); // fin DOMContentLoaded

/**
 * Crea y añade una nueva fila a la tabla de contribuciones,
 * incluyendo un enlace al PDF subido.
 */
function agregarFila(fd) {
    const tbody = document.getElementById('tablaContribuciones');
    const tr = document.createElement('tr');

    // Columnas de datos habituales
    ['titulo', 'descripcion', 'categoria', 'fecha', 'autor'].forEach(key => {
        const td = document.createElement('td');
        td.textContent = fd.get(key);
        tr.appendChild(td);
    });

    // Columna "Archivo" con enlace al PDF
    const tdFile = document.createElement('td');
    const file = fd.get('archivo');
    if (file && file.name) {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(file);
        link.target = '_blank';
        link.textContent = file.name;
        tdFile.appendChild(link);
    }
    tr.appendChild(tdFile);

    // Celda de acciones (Editar / Eliminar)
    const tdAcc = document.createElement('td');
    botones.crearBotonesAcciones(
        tdAcc,
        document.createElement('img'),
        botones.botones.btnEditar.id,
        botones.botones.btnEditar.ruta,
        botones.botones.btnEditar.title
    );
    botones.crearBotonesAcciones(
        tdAcc,
        document.createElement('img'),
        botones.botones.btnEliminar.id,
        botones.botones.btnEliminar.ruta,
        botones.botones.btnEliminar.title
    );
    tr.appendChild(tdAcc);

    tbody.appendChild(tr);
}

function ocultarTablaContribuciones() {
    document.getElementById('tableWrapper').style.display = 'none';
}

function mostrarTablaContribuciones() {
    document.getElementById('tableWrapper').style.display = 'block';
}
