// Propiedades de los botones
const botones = {
    btnEditar: {
        id: 'btnEditar',
        className: 'btn-img',
        ruta: '/src/assets/icon/edit.png',
        title: 'Editar',
        alt: 'Editar',
    },
    btnEliminar: {
        id: 'btnEliminar',
        className: 'btn-img',
        ruta: '/src/assets/icon/delete.png',
        title: 'Eliminar',
        alt: 'Eliminar',
    },
    btnGuardar: {
        id: 'btnGuardar',
        className: 'btn-img',
        ruta: '/src/assets/icon/update.png',
        title: 'Guardar',
        alt: 'Guardar',
    },
    btnCancelar: {
        id: 'btnCancelar',
        className: 'btn-img',
        ruta: '/src/assets/icon/cancel.png',
        title: 'Cancelar',
        alt: 'Cancelar',
    },
};

// Función para crear los botones de acción
function crearBotonesAcciones(celdaAcciones, imgBoton, id, ruta, title) {
    imgBoton.id = id;
    imgBoton.src = ruta;
    imgBoton.title = title;
    imgBoton.alt = title;
    imgBoton.className = 'btn-img';
    celdaAcciones.appendChild(imgBoton);
}

// Función para cambiar el evento de un botón
function botonConEvento(event, nuevoId, nuevaRuta, nuevoTitulo) {
    const t = event.target;
    if (t) {
        t.id = nuevoId;
        t.src = nuevaRuta;
        t.title = nuevoTitulo;
        t.alt = nuevoTitulo;
    }
}

// Función para cambiar el evento de un botón sin evento
function botonSinEvento(boton, nuevoId, nuevaRuta, nuevoTitulo) {
    if (boton) {
        boton.id = nuevoId;
        boton.src = nuevaRuta;
        boton.title = nuevoTitulo;
        boton.alt = nuevoTitulo;
    }
}

export default { botones, crearBotonesAcciones, botonConEvento, botonSinEvento };
