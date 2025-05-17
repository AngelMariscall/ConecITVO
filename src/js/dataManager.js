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
}
