import Buttons from "./botones.js";
import Contribucion from "./contribucion.js";
import DataManager from "./dataManager.js";

const dataManager = new DataManager("Contribuciones");

document.addEventListener('DOMContentLoaded', function () {
    if (sessionStorage.getItem("loggedIn") !== "true") {
        window.location.href = "/src/index.html";
    }

    ocultarTablaProductos();

    // === SUBIR CONTRIBUCIÓN ===
    document.getElementById('formContribucion').addEventListener('submit', function (event) {
        event.preventDefault();

        if (!this.checkValidity()) {
            this.classList.add('was-validated');
            return;
        }

        const formData = new FormData(this);
        const archivo = formData.get('archivo');
        const id = formData.get('identificador');
        const db = dataManager.readData();

        if (db.some(item => item.id === id)) {
            mostrarModal("El ID ya existe. Usa uno diferente.", "warning");
            return;
        }

        const archivoURL = URL.createObjectURL(archivo);

        const nuevaContribucion = new Contribucion(
            id,
            formData.get('titulo'),
            formData.get('descripcion'),
            formData.get('categoria'),
            formData.get('fecha'),
            formData.get('autor'),
            archivoURL
        );

        //crea en sessionStorage
        dataManager.createData(nuevaContribucion);
        mostrarModal("Contribución guardada correctamente", "success");
        resetearFormulario(this);

        //Agregar fila a la tabla
        const wrapper = document.getElementById('tableWrapper');
        if (wrapper.style.display !== 'none') {
            // La tabla ya está visible, así que solo agregamos la fila recién creada:
            const tbody = document.getElementById('tablaContribuciones');
            // Construimos la fila igual que en agregarFilaTabla pero para un solo objeto:
            const tr = document.createElement('tr');
            const props = ["id", "titulo", "descripcion", "categoria", "fecha", "autor"];
            props.forEach(prop => {
                const td = document.createElement('td');
                td.textContent = nuevaContribucion[prop];
                tr.appendChild(td);
            });
            // Celda de archivo:
            const archivoCell = document.createElement('td');
            archivoCell.dataset.archivo = nuevaContribucion.archivo;
            const verBtn = document.createElement('button');
            verBtn.textContent = "Ver archivo";
            verBtn.className = "btn btn-primary btn-sm";
            verBtn.addEventListener('click', () => window.open(nuevaContribucion.archivo, '_blank'));
            archivoCell.appendChild(verBtn);
            tr.appendChild(archivoCell);
            // Celda de acciones:
            const actionsCell = document.createElement('td');
            const btnEditar = document.createElement('img');
            const btnEliminar = document.createElement('img');
            Buttons.crearBotonesAcciones(
                actionsCell, btnEditar,
                Buttons.botones.btnEditar.id, Buttons.botones.btnEditar.ruta, Buttons.botones.btnEditar.title
            );
            Buttons.crearBotonesAcciones(
                actionsCell, btnEliminar,
                Buttons.botones.btnEliminar.id, Buttons.botones.btnEliminar.ruta, Buttons.botones.btnEliminar.title
            );
            tr.appendChild(actionsCell);

            // Finalmente lo pegamos al tbody:
            tbody.appendChild(tr);
        }
    });

    // === MOSTRAR CONTRIBUCIONES ===
    document.getElementById('btnShowProducts').addEventListener('click', function () {
        const db = dataManager.readData();

        if (db.length === 0) {
            mostrarModal("No hay contribuciones que mostrar", "info");
            return;
        }

        const tbody = document.getElementById('tablaContribuciones');
        agregarFilaTabla(db, tbody);
        mostrarTablaProductos();
    });

    // === ELIMINAR TODAS LAS CONTRIBUCIONES ===
    document.getElementById('btnDeleteAllProducts').addEventListener('click', function () {
        const modal = new bootstrap.Modal(document.getElementById('confirmModal'));
        const mensaje = document.getElementById('confirmModalMessage');

        mensaje.textContent = "¿Estás seguro de que deseas eliminar todas las contribuciones?";
        modal.show();

        document.getElementById('btnModalConfirmar').onclick = () => {
            dataManager.clearData();
            ocultarTablaProductos();
            mostrarModal("Todas las contribuciones han sido eliminadas", "success");
            modal.hide();
        };
    });

    // ——— BÚSQUEDA GLOBAL ———
    document.getElementById('btnSearch').addEventListener('click', () => {
        const term = document.getElementById('searchInput')
            .value.trim()
            .toLowerCase();
        const rows = document.querySelectorAll('#tablaContribuciones tr');
        if (!term) {
            mostrarModal("Ingresa texto para buscar.", "warning");
            return;
        }
        let found = false;
        rows.forEach(row => {
            // tomamos todas las celdas excepto la última (acciones)
            const text = Array.from(row.cells)
                .slice(0, -1)
                .map(td => td.textContent.toLowerCase())
                .join(' ');
            if (text.includes(term)) {
                row.style.display = '';
                found = true;
            } else {
                row.style.display = 'none';
            }
        });
        if (!found) mostrarModal("No se encontró ninguna coincidencia.", "info");
    });

    // ——— LIMPIAR BÚSQUEDA ———
    document.getElementById('btnClearSearch').addEventListener('click', () => {
        document.getElementById('searchInput').value = '';
        document.querySelectorAll('#tablaContribuciones tr')
            .forEach(row => row.style.display = '');
    });

    let datosCeldas = [];
    let archivoOriginal = null;     // <-- para almacenar la URL previa
    let modoEdicionActivo = false;

    document.getElementById('tablaContribuciones').addEventListener('click', function (event) {
        const idBoton = event.target.id;
        const fila = event.target.closest('tr');
        if (!fila) return;

        // === EDITAR ===
        if (idBoton === 'btnEditar') {
            if (modoEdicionActivo) {
                mostrarModal("Finaliza la edición de la fila actual antes de editar otra", "error");
                return;
            }
            modoEdicionActivo = true;

            const celdas = fila.querySelectorAll('td');
            datosCeldas = [];

            celdas.forEach((celda, i) => {
                if (i === 0 || i >= celdas.length - 2) return;

                const valor = celda.textContent.trim();
                datosCeldas.push(valor);

                if (i === 4) {
                    const inputFecha = document.createElement('input');
                    inputFecha.type = 'date';
                    inputFecha.className = 'form-control';
                    inputFecha.value = valor;
                    celda.textContent = '';
                    celda.appendChild(inputFecha);
                    return;
                }

                if (i === 3) {
                    const selectOriginal = document.getElementById('categoria');
                    const select = selectOriginal.cloneNode(true);
                    select.className = 'form-select';
                    select.value = valor;
                    celda.textContent = '';
                    celda.appendChild(select);
                    return;
                }

                const input = document.createElement('input');
                input.type = 'text';
                input.value = valor;
                input.className = 'form-control';
                celda.textContent = '';
                celda.appendChild(input);
            });

            const celdaArchivo = celdas[celdas.length - 2];
            archivoOriginal = celdaArchivo.dataset.archivo || null;
            const botonArchivo = document.createElement('button');
            botonArchivo.textContent = "Cambiar archivo";
            botonArchivo.className = "btn btn-warning btn-sm";

            botonArchivo.addEventListener('click', () => {
                const inputFile = document.createElement('input');
                inputFile.type = 'file';
                inputFile.accept = '*/*';

                inputFile.addEventListener('change', (e) => {
                    const nuevoArchivo = e.target.files[0];
                    if (nuevoArchivo.size > 50 * 1024 * 1024) {
                        mostrarModal("El archivo excede el límite de 50 MB.", "error");
                        return;
                    }
                    const urlArchivo = URL.createObjectURL(nuevoArchivo);
                    celdaArchivo.dataset.archivo = urlArchivo;
                    mostrarModal("Archivo actualizado correctamente", "success");
                });

                inputFile.click();
            });

            celdaArchivo.textContent = '';
            celdaArchivo.appendChild(botonArchivo);

            const btnEditar = fila.querySelector('#btnEditar');
            const btnEliminar = fila.querySelector('#btnEliminar');

            Buttons.botonConEvento(
                event,
                Buttons.botones.btnGuardar.id,
                Buttons.botones.btnGuardar.ruta,
                Buttons.botones.btnGuardar.title
            );

            Buttons.botonSinEvento(
                btnEliminar,
                Buttons.botones.btnCancelar.id,
                Buttons.botones.btnCancelar.ruta,
                Buttons.botones.btnCancelar.title
            );
        }

        // === GUARDAR ===
        if (idBoton === 'btnGuardar') {
            const celdas = fila.querySelectorAll('td');
            const id = fila.cells[0].textContent;

            const inputTitulo = celdas[1].querySelector('input');
            const inputDescripcion = celdas[2].querySelector('input');
            const selectCategoria = celdas[3].querySelector('select');
            const inputFecha = celdas[4].querySelector('input');
            const inputAutor = celdas[5].querySelector('input');
            const celdaArchivo = celdas[6];
            const archivoURL = celdaArchivo.dataset.archivo;

            if (
                !inputTitulo.value.trim() ||
                !inputDescripcion.value.trim() ||
                !selectCategoria.value ||
                !inputFecha.value
            ) {
                mostrarModal("Por favor, completa todos los campos obligatorios.", "warning");
                modoEdicionActivo = true;
                return;
            }

            const nuevaContribucion = new Contribucion(
                id,
                inputTitulo.value.trim(),
                inputDescripcion.value.trim(),
                selectCategoria.value,
                inputFecha.value,
                inputAutor.value.trim(),
                archivoURL || dataManager.readData().find(a => a.id === id).archivo
            );

            dataManager.updateData(id, nuevaContribucion);
            const db = dataManager.readData();
            const tbody = document.getElementById('tablaContribuciones');
            agregarFilaTabla(db, tbody);
            mostrarModal("Contribución actualizada correctamente", "success");
            modoEdicionActivo = false;
        }

        // === CANCELAR ===
        if (idBoton === 'btnCancelar') {
            modoEdicionActivo = false;
            const celdas = fila.querySelectorAll('td');
            let iDato = 0;

            celdas.forEach((celda, i) => {
                if (i === 0) return;

                if (i === celdas.length - 2) {
                    celda.textContent = '';
                    const btnVerArchivo = document.createElement('button');
                    btnVerArchivo.textContent = "Ver archivo";
                    btnVerArchivo.className = "btn btn-primary btn-sm";
                    btnVerArchivo.addEventListener('click', () => {
                        if (archivoOriginal) window.open(archivoOriginal, "_blank");
                    });
                    celda.dataset.archivo = archivoOriginal;
                    celda.appendChild(btnVerArchivo);
                    return;
                }

                if (i === celdas.length - 1) return;

                celda.textContent = datosCeldas[iDato];
                iDato++;
            });

            const btnCancelar = fila.querySelector('#btnCancelar');
            const btnGuardar = fila.querySelector('#btnGuardar');

            Buttons.botonConEvento(
                { target: btnGuardar }, // ahora el que era Guardar se vuelve Editar
                Buttons.botones.btnEditar.id,
                Buttons.botones.btnEditar.ruta,
                Buttons.botones.btnEditar.title
            );

            Buttons.botonSinEvento(
                btnCancelar, // el que era Cancelar se vuelve Eliminar
                Buttons.botones.btnEliminar.id,
                Buttons.botones.btnEliminar.ruta,
                Buttons.botones.btnEliminar.title
            );

            mostrarModal("Edición cancelada", "info");
        }

        // === ELIMINAR ===
        if (idBoton === 'btnEliminar') {
            const id = fila.cells[0].textContent;
            const modal = new bootstrap.Modal(document.getElementById('confirmModal'));
            const mensaje = document.getElementById('confirmModalMessage');

            mensaje.textContent = "¿Estás seguro de que deseas eliminar esta contribución?";
            modal.show();

            document.getElementById('btnModalConfirmar').onclick = () => {
                fila.remove();
                dataManager.deleteData(id);
                mostrarModal("Contribución eliminada correctamente", "success");

                if (document.querySelectorAll('#tablaContribuciones tr').length === 0) {
                    ocultarTablaProductos();
                }

                modal.hide();
            };
        }
    });
});

// === FUNCIONES AUXILIARES ===

function resetearFormulario(form) {
    form.reset();
    form.classList.remove('was-validated');
}

function mostrarTablaProductos() {
    document.getElementById('tableWrapper').style.display = 'block';
}

function ocultarTablaProductos() {
    document.getElementById('tableWrapper').style.display = 'none';
}

function agregarFilaTabla(dataSession, tbody) {
    tbody.textContent = "";
    for (const articulo of dataSession) {
        const newRow = document.createElement('tr');
        const props = ["id", "titulo", "descripcion", "categoria", "fecha", "autor"];

        props.forEach(prop => {
            const td = document.createElement('td');
            td.textContent = articulo[prop];
            newRow.appendChild(td);
        });

        const archivoCell = document.createElement('td');
        archivoCell.setAttribute('data-archivo', articulo.archivo);
        const verBtn = document.createElement('button');
        verBtn.textContent = "Ver archivo";
        verBtn.className = "btn btn-primary btn-sm";
        verBtn.addEventListener('click', () => window.open(articulo.archivo, '_blank'));
        archivoCell.appendChild(verBtn);
        newRow.appendChild(archivoCell);

        const actionsCell = document.createElement('td');
        const btnEditar = document.createElement('img');
        const btnEliminar = document.createElement('img');

        Buttons.crearBotonesAcciones(
            actionsCell, btnEditar,
            Buttons.botones.btnEditar.id,
            Buttons.botones.btnEditar.ruta,
            Buttons.botones.btnEditar.title);

        Buttons.crearBotonesAcciones(
            actionsCell, btnEliminar,
            Buttons.botones.btnEliminar.id,
            Buttons.botones.btnEliminar.ruta,
            Buttons.botones.btnEliminar.title);

        newRow.appendChild(actionsCell);
        tbody.appendChild(newRow);
    }
}

function mostrarModal(mensaje, tipo = "info", conBotones = false, callbackAceptar = null) {
    const modal = new bootstrap.Modal(document.getElementById('miModal'));
    const titulo = document.getElementById('miModalLabel');
    const cuerpo = document.getElementById('modalCuerpo');
    const footer = document.getElementById('modalFooter');
    const btnAceptar = document.getElementById('btnModalAceptar');
    const btnCancelar = document.getElementById('btnModalCancelar');

    // Tipos de mensaje
    const tipos = {
        success: { titulo: "Éxito", color: "bg-success" },
        error: { titulo: "Error", color: "bg-danger" },
        warning: { titulo: "Advertencia", color: "bg-warning text-dark" },
        info: { titulo: "Información", color: "bg-primary" },
    };

    const { titulo: tit, color } = tipos[tipo] || tipos.info;

    // Estilos
    titulo.textContent = tit;
    titulo.parentElement.className = `modal-header text-white ${color}`;
    cuerpo.textContent = mensaje;

    // Mostrar botones si se pide
    if (conBotones && callbackAceptar) {
        footer.classList.remove("d-none");
        btnAceptar.onclick = () => {
            callbackAceptar();
            modal.hide();
        };
        btnCancelar.onclick = () => modal.hide();
    } else {
        footer.classList.add("d-none");
    }

    modal.show();

    // Ocultar automáticamente si no hay botones
    if (!conBotones) {
        setTimeout(() => modal.hide(), 2000);
    }
}
