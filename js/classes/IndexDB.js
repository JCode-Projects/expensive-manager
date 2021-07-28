import UserInterface from './UserInterface.js';

let ui;

class IndexDB {
    constructor() {
        ui = new UserInterface();
        const createDB = window.indexedDB.open("manager", 1);

        createDB.onerror = () => ui.showAlert("Ha ocurrido un error", "error");

        createDB.onsuccess = () => {
            this.db = createDB.result;
        };

        createDB.onupgradeneeded = e => {
            const db = e.target.result;
            
            const objectStore = db.createObjectStore("manager", { keyPath: "id", autoIncrement: true });
            objectStore.createIndex("id", "id", { unique: true });
            objectStore.createIndex("description", "description", { unique: false });
            objectStore.createIndex("value", "value", { unique: false });
            objectStore.createIndex("date", "date", { unique: false });
            objectStore.createIndex("type", "type", { unique: false });

            ui.showAlert("Todo configurado y listo para trabajar.");
        }
    }

    selectAllToDB() {
        const cursor = this.db.transaction("manager").objectStore("manager").openCursor();

        cursor.onerror = () => ui.showAlert("No se pudieron obtener todos los registros.", "error");

        cursor.onsuccess = function(e) {
            const cursor = e.target.result;
            if(cursor) {
                ui.addItemInDOM(cursor);
                cursor.continue();
            }
        }
    }

    insertToDB(element) {
        this.db.transaction(["manager"], "readwrite").objectStore("manager").add(element);
        return true;
    }

    deleteToDB(id) {
        this.db.transaction(["manager"], "readwrite").objectStore("manager").delete(id);
        return true;
    }

    clearDB() {
        this.db.transaction(["manager"], "readwrite").objectStore("manager").clear();
        return true;
    }
}

export default IndexDB;