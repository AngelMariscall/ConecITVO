export default class DataManager {
    constructor(keySession) {
        this.keySession = keySession;
        this.dbSession = JSON.parse(sessionStorage.getItem(this.keySession)) || [];
    }

    //CRUD
    //Create
    createData(objArticulo) {
        this.dbSession.push(objArticulo);
        sessionStorage.setItem(this.keySession, JSON.stringify(this.dbSession));
    }

    //Read
    readData() {
        return this.dbSession;
    }

    //Update
    updateData(id, newArticulo) {
        this.dbSession = this.dbSession.map((articulo) => {
            if (articulo.id === id) {
                return { ...articulo, ...newArticulo };
            }
            return articulo;
        });
        sessionStorage.setItem(this.keySession, JSON.stringify(this.dbSession));
    }

    //Delete
    deleteData(id) {
        this.dbSession = this.dbSession.filter((articulo) => articulo.id !== id);
        sessionStorage.setItem(this.keySession, JSON.stringify(this.dbSession));
    }

    //Clear
    clearData() {
        this.dbSession = [];
        sessionStorage.removeItem(this.keySession);
        this.dbSession = JSON.parse(sessionStorage.getItem(this.keySession)) || [];
    }
}