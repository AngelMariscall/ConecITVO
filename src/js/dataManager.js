// Almacenamiento en local storage
export default class DataManager {
    constructor(keyStorage) {
        this.keyStorage = keyStorage;
        this.dbStorage = JSON.parse(localStorage.getItem(this.keyStorage)) || [];
    }

    // CREATE
    createData(objContribucion) {
        this.dbStorage.push(objContribucion);
        localStorage.setItem(this.keyStorage, JSON.stringify(this.dbStorage));
    }

    // READ
    readData() {
        return this.dbStorage;
    }

    // UPDATE
    updateData(id, nuevaContribucion) {
        this.dbStorage = this.dbStorage.map((contribucion) => {
            if (contribucion.id === id) {
                return { ...contribucion, ...nuevaContribucion };
            }
            return contribucion;
        });
        localStorage.setItem(this.keyStorage, JSON.stringify(this.dbStorage));
    }

    // DELETE
    deleteData(id) {
        this.dbStorage = this.dbStorage.filter((contribucion) => contribucion.id !== id);
        localStorage.setItem(this.keyStorage, JSON.stringify(this.dbStorage));
    }

    // CLEAR
    clearData() {
        this.dbStorage = [];
        localStorage.removeItem(this.keyStorage);
        this.dbStorage = JSON.parse(localStorage.getItem(this.keyStorage)) || [];
    }
}

/*
ALMACENAMIOENTO EN SESSION STORAGE
export default class DataManager {
    constructor(keySession) {
        this.keySession = keySession;
        this.dbSession = JSON.parse(sessionStorage.getItem(this.keySession)) || [];
    }

    // CREATE
    createData(objContribucion) {
        this.dbSession.push(objContribucion);
        sessionStorage.setItem(this.keySession, JSON.stringify(this.dbSession));
    }

    // READ
    readData() {
        return this.dbSession;
    }

    // UPDATE
    updateData(id, nuevaContribucion) {
        this.dbSession = this.dbSession.map((contribucion) => {
            if (contribucion.id === id) {
                return { ...contribucion, ...nuevaContribucion };
            }
            return contribucion;
        });
        sessionStorage.setItem(this.keySession, JSON.stringify(this.dbSession));
    }

    // DELETE
    deleteData(id) {
        this.dbSession = this.dbSession.filter((contribucion) => contribucion.id !== id);
        sessionStorage.setItem(this.keySession, JSON.stringify(this.dbSession));
    }

    // CLEAR
    clearData() {
        this.dbSession = [];
        sessionStorage.removeItem(this.keySession);
        this.dbSession = JSON.parse(sessionStorage.getItem(this.keySession)) || [];
    }
}*/