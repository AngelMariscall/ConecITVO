import Buttons from "./buttons.js";
import Contribucion from "./contribucion.js";
import DataManager from "./dataManager.js";

document.addEventListener('DOMContentLoaded', function () {
    if (sessionStorage.getItem("loggedIn") !== "true") { // Verificar si el usuario está logueado
        // Si no está logueado, redirigir a login
        window.location.href = "/src/index.html";
    }

    // Ocultar la tabla al cargar la página
    ocultarTablaProductos();



    let datosCeldas = []; // Array para almacenar los datos de las celdas


    // EVENTOS EN LOS BOTONES    
    document.getElementById('tablaContribuciones').addEventListener('click', function (event) {
        // event contiene información sobre el evento que ocurrió
        // event.target.id accede al elemento (etiqueta) específico dentro de #tbodyProductos que fue clickeado.


        // ACCIONES DE LOS BOTONES

        if (event.target.id === 'btnEditar') {
            const rowEdit = event.target.closest('tr');
            const cells = rowEdit.querySelectorAll('td'); // Selecciona todas las celdas de la fila
            datosCeldas = []; // Reinicia el array de datos de celdas

            cells.forEach((cell, index) => {
                if (index < cells.length - 2 && index !== 0) { // Evita la última celda (acciones) y evita la celda del ID
                    const valorActual = cell.textContent; // Obtiene el valor actual de la celda
                    datosCeldas.push(valorActual); // Agrega el valor actual al array
                    const input = document.createElement('input'); // Crea un campo de entrada
                    input.type = 'text';
                    input.value = valorActual; // Establece el valor actual como predeterminado
                    input.className = 'form-control'; // Clase opcional para estilos
                    cell.textContent = ''; // Limpia el contenido de la celda anterior para colocar el input
                    cell.appendChild(input); // Agrega el campo de entrada a la celda
                } else if (index === cells.length - 2) { // Celda del archivo
                    const archivoButton = document.createElement('button');
                    archivoButton.textContent = "Cambiar archivo";
                    archivoButton.className = "btn btn-warning btn-sm";
                    archivoButton.addEventListener('click', () => {
                        const inputFile = document.createElement('input');
                        inputFile.type = 'file';
                        inputFile.accept = 'application/pdf';
                        inputFile.addEventListener('change', (e) => {
                            const nuevoArchivo = e.target.files[0];
                            if (nuevoArchivo && nuevoArchivo.type === 'application/pdf') {
                                const nuevoArchivoURL = URL.createObjectURL(nuevoArchivo);
                                cell.dataset.archivo = nuevoArchivoURL; // Almacena la nueva URL temporalmente
                                mostrarAlerta("Archivo actualizado correctamente", "alert alert-success");
                            } else {
                                mostrarAlerta("Por favor, selecciona un archivo PDF válido.", "alert alert-danger");
                            }
                        });
                        inputFile.click();
                    });
                    cell.textContent = '';
                    cell.appendChild(archivoButton);
                }
            });

            // aqui funciona con tarjet porque es el elemento que disparó el evento
            Buttons.changeButtonEvent(event, Buttons.botones.btnSave.id, Buttons.botones.btnSave.ruta, Buttons.botones.btnSave.title); // Cambia el botón de editar a guardar

            // no funciona con getElementById porque no es un nodo de documento, es una celda
            const deleteButton = rowEdit.querySelector('#btnEliminar'); // Selecciona el botón de eliminar
            Buttons.changeButtonNotEvent(deleteButton, Buttons.botones.btnCancel.id, Buttons.botones.btnCancel.ruta, Buttons.botones.btnCancel.title); // Cambia el botón de eliminar a cancelar

            return; // Salir de la función después de editar
        }

        if (event.target.id.startsWith('btnEliminar')) {
            const rowDelete = event.target.closest('tr'); // Encuentra la fila más cercana al botón
            const idDelete = rowDelete.querySelectorAll('td')[0].textContent; // Obtiene el ID del artículo

            if (!confirm("¿Estás seguro de que deseas eliminar este producto?")) {
                rowDelete.remove(); // Elimina la fila de la tabla
                dataManager.deleteData(idDelete); // Elimina el artículo de la sesión

                // Ocultar la tabla si no hay más filas
                if (document.querySelectorAll('#tbodyProductos tr').length === 0) {
                    ocultarTablaProductos();
                }
            }
        }

        if (event.target.id === 'btnGuardar') {
            const rowSave = event.target.closest('tr');
            const id = rowSave.querySelectorAll('td')[0].textContent; // Obtiene el ID del artículo
            const input = rowSave.querySelectorAll('input'); // Selecciona todas las celdas de la fila
            const archivoCell = rowSave.querySelector('td[data-archivo]');

            const nuevoArchivo = archivoCell ? archivoCell.dataset.archivo : null;

            const newContribucion = new Contribucion();
            newContribucion.id = id;
            newContribucion.titulo = input[0].value;
            newContribucion.descripcion = input[1].value;
            newContribucion.categoria = input[2].value;
            newContribucion.fecha = input[3].value;
            newContribucion.autor = input[4].value;
            nuevoArchivo || dataManager.readData().find(a => a.id === id).archivo // Mantén el archivo original si no se cambió



            dataManager.updateData(id, newContribucion); // Actualiza el artículo en la sesión
            const dbArticulos = dataManager.readData(); // Guarda el artículo actualizado en la sesión
            // obtener el cuerpo de la tabla
            const tbody = document.getElementById('tbodyProductos');
            // Agregar celdas con los valores del formulario
            agregarFilaTabla(dbArticulos, tbody);
            mostrarTablaProductos(); // Mostrar la tabla de productos
            return; // Salir de la función después de guardar
        }

        if (event.target.id === 'btnCancelar') {
            const rowCancel = event.target.closest('tr');
            const cells = rowCancel.querySelectorAll('input'); // Selecciona todas las celdas de la fila

            // Verifica que datosCeldas tenga los valores esperados
            if (datosCeldas.length !== cells.length) {
                console.error('El array datosCeldas no coincide con el número de celdas.');
                return; // Salir si hay un problema con los datos
            }

            cells.forEach((cell, index) => {
                if (index < cells.length) { // Evita la última celda (acciones)
                    const valorActual = datosCeldas[index]; // Obtiene el valor actual del campo de entrada
                    cell.parentNode.textContent = valorActual; // Establece el nuevo valor en la celda
                }
            });


            Buttons.changeButtonEvent(event, Buttons.botones.btnDelete.id, Buttons.botones.btnDelete.ruta, Buttons.botones.btnDelete.title); // Cambia el botón de cancelar a eliminar
            // no funciona con getElementById porque no es un nodo de documento, es una celda
            const saveButton = rowCancel.querySelector('#btnGuardar'); // Selecciona el botón de guardar
            Buttons.changeButtonNotEvent(saveButton, Buttons.botones.btnEdit.id, Buttons.botones.btnEdit.ruta, Buttons.botones.btnEdit.title); // Cambia el botón de guardar a editar
            return; // Salir de la función después de cancelar
        }

    });
});


const dataManager = new DataManager("Articulos"); // Clase DataManager




document.getElementById('formContribucion').addEventListener('submit', function (event) {
    event.preventDefault(); // Evita el envío del formulario


    // Verificar si el formulario está válidado
    if (!this.checkValidity()) {
        this.classList.add('was-validated'); // Agrega estilos de validación de Bootstrap
        return; // Detiene la ejecución si el formulario no está válidado
    }

    // Obtener los datos del formulario. this hace referencia al formulario actual frmAltaProducto
    const formData = new FormData(this);
    const archivo = formData.get('archivo'); // Obtiene el archivo del formulario

    //Validar que no se repitan los ID de los articulos
    const idArticulo = formData.get('identificador'); // ID del archivo
    const dbArticulos = dataManager.readData();
    if (dbArticulos.some(articulo => articulo.id === idArticulo)) {
        mostrarAlerta("La contribucion ya existe", "alert alert-danger");
        return;
    }

    const archivoURL = URL.createObjectURL(archivo); // Crea una URL temporal para el archivo PDF

    const objContribucion = new Contribucion( //Conector de la clase Articulo
        formData.get('identificador'), // ID del archivo
        formData.get('titulo'),        // Título del archivo
        formData.get('autor'),         // Nombre del autor
        formData.get('categoria'),     // Categoría
        formData.get('fecha'),         // Fecha de contribución
        formData.get('descripcion'),   // Descripción breve
        archivoURL);                   // Archivo PDF

    console.log(objContribucion);

    dataManager.createData(objContribucion); // Guardar el objeto en la sesión
    console.log(dataManager.readData());
    mostrarAlerta("los datos se guardaron correctamente", "alert alert-success"); // Mostrar mensaje de éxito
    resetearFormulario(this); // Llamar a la función para resetear el formulario
});




document.getElementById('btnShowProducts').addEventListener('click', function () {

    const dbArticulos = dataManager.readData(); // Obtener los datos de la sesión
    const tbody = document.getElementById('tablaContribuciones'); // Obtener el cuerpo de la tabla

    agregarFilaTabla(dbArticulos, tbody); // Llamar a la función para agregar filas a la tabla
    mostrarTablaProductos(); // Mostrar la tabla de productos



});


document.getElementById('btnDeleteAllProducts').addEventListener('click', function () {
    if (confirm("¿Estás seguro de que deseas eliminar todos los productos?")) {
        dataManager.clearDB(); // Limpiar la sesión
        ocultarTablaProductos(); // Ocultar la tabla de productos
        mostrarAlerta("Se eliminaron todos los productos", "alert alert-success"); // Mostrar mensaje de éxito
    }
});



const agregarFilaTabla = (dataSession, tbody) => {
    tbody.textContent = "";

    for (const articulo of dataSession) {
        const newRow = document.createElement('tr');
        const propiedades = ["id", "titulo", "autor", "categoria", "fecha", "descripcion"];
        propiedades.forEach(propiedad => {
            createCell(newRow, articulo[propiedad]);
        });

        // Crear celda de archivo con enlace al PDF
        const archivoCell = document.createElement('td');
        const archivoButton = document.createElement('button');
        archivoButton.textContent = "Ver archivo";
        archivoButton.className = "btn btn-primary btn-sm";
        archivoButton.addEventListener('click', () => {
            window.open(articulo.archivo, 'blank'); // Abrir el archivo en una nueva pestaña
        });
        archivoCell.appendChild(archivoButton);
        newRow.appendChild(archivoCell);

        const actionsCell = document.createElement('td');
        const editButton = document.createElement('img');
        const deleteButton = document.createElement('img');
        // Crea el boton de guardar
        Buttons.crearBotonesAcciones(actionsCell, editButton, Buttons.botones.btnEdit.id, Buttons.botones.btnEdit.ruta, Buttons.botones.btnEdit.title);
        // Crea el boton de Eliminar
        Buttons.crearBotonesAcciones(actionsCell, deleteButton, Buttons.botones.btnDelete.id, Buttons.botones.btnDelete.ruta, Buttons.botones.btnDelete.title);

        // Agregar la celda de acciones a la fila
        newRow.appendChild(actionsCell);

        // Agregar la nueva fila al cuerpo de la tabla
        tbody.appendChild(newRow);
    }
}


function createCell(row, value) {
    const cell = document.createElement('td');
    cell.textContent = value;
    row.appendChild(cell);
}


// Funciones =====================================

function resetearFormulario(form) {
    form.reset();
}


function mostrarTablaProductos() {
    const divListaProductos = document.getElementById('tableWrapper');
    const tbody = document.getElementById('tablaContribuciones');
    if (tbody.children.length === 0) {
        divListaProductos.style.display = 'none'; // Oculta la tabla si no hay registros
        mostrarAlerta("No hay productos registrados", "alert alert-warning"); // Mostrar mensaje de advertencia
    } else {
        divListaProductos.style.display = 'block'; // Muestra la tabla si hay registros
    }
}

function ocultarTablaProductos() {
    const divListaProductos = document.getElementById('tableWrapper');
    divListaProductos.style.display = 'none'; // Oculta la tabla
}

function mostrarAlerta(msg, tipoAlerta) {
    try {
        const divresponseInformation = document.getElementById("responseInformation");
        divresponseInformation.textContent = msg;
        divresponseInformation.className = tipoAlerta;
        divresponseInformation.style.display = "block";
        divresponseInformation.classList.add("fade-in");

        setTimeout(() => {
            divresponseInformation.classList.add("fade-out");
            setTimeout(() => {
                divresponseInformation.style.display = "none";
                divresponseInformation.classList.remove("fade-in", "fade-out");
            }, 2000); // Tiempo de duración de la animación (1 segundo)
        }, 2000); // Tiempo de visualización del mensaje antes de desaparecer (2 segundos)

    } catch (error) {
        console.log("Error en mostrar alerta: " + error);
    }
}