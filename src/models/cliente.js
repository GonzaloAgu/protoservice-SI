const db = require('./src/controllers/pg.js');

class Cliente {
    constructor(dni) {
        this.dni = dni;
        this.nombre = null;
        this.telefono = null;
    }
    
    get dni(){
        return this.dni;
    }

    get nombre() {
        return this.nombre;
    }

    get telefono() {
        return this.telefono;
    }

    set nombre(nombre){
        this.nombre = nombre;
    }

    set telefono(tel){
        this.telefono = tel;
    }

    loadFromDb(){
        let result = db.buscarCliente(this.dni);
        if(result.existe){
            this.nombre = result.cliente.nombre;
            this.telefono = result.cliente.telefono;
            return true;
        }
        return false;
    }

    saveObj(){
        try {
            let result = db.agregarCliente(this.dni, this.nombre, this.telefono);
            return true;
        } catch(e){
            return false;
        }
    }
}