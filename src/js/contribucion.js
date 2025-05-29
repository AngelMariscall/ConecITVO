
export default class contribucion {

    // Constructor del objeto contribucion
    constructor(id, titulo, descripcion, categoria, fecha, autor, archivoURL, nombreArchivo) {
        this.id = id;
        this.titulo = titulo;
        this.descripcion = descripcion;
        this.categoria = categoria;
        this.fecha = fecha;
        this.autor = autor;
        this.archivo = archivoURL;
        this.nombreArchivo = nombreArchivo;
    }
}