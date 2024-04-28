const { logTS } = require('../utils/log');
const pool = require("../controllers/pg").getInstance();


module.exports = class Cliente {
    constructor(dni) {
        this._dni = dni;
        this._nombre = null;
        this._telefono = null;
    }
    
    getDni(){
        return this._dni;
    }

    getNombre() {
        return this._nombre;
    }

    getTelefono() {
        return this._telefono;
    }

    setNombre(nombre){
        this._nombre = nombre;
    }

    setTelefono(tel){
        this._telefono = tel;
    }
    /**
     * Busca y obtiene al cliente en la base de datos.
     * @returns true si lo encontró, false si no existe.
     */
    async obtener(){
        let result = await pool.query("SELECT * FROM cliente WHERE dni=$1;", [this._dni]);
        if(result.rows.length){
            const cliente = result.rows[0];
            this._nombre = cliente.nombre;
            this._telefono = cliente.telefono;
            return true;
        }
        return false;
    }

    /**
     * Almacena datos del cliente en la base de datos. Si no existia, lo agrega.
     * @returns 1 si lo agrego en la base. 0 si lo modifico. -1 si se produjo un error.
     */
    async guardar() {
        try {
            const values = [this._dni, this._nombre, this._telefono];
            const existe = (await pool.query("SELECT * FROM cliente WHERE dni=$1;", [this._dni])).rows.length == 1;
    
            if (!existe) {
                logTS(`Insertando cliente ${this.toString()}...`);
                const result = await pool.query("INSERT INTO cliente(dni, nombre, telefono) VALUES($1, $2, $3)", values);
                logTS(result.command + " finalizado.");
                return 1;
            } else {
                logTS(`Actualizando cliente ${this.toString()}...`);
                const result = await pool.query("UPDATE cliente SET nombre=$2, telefono=$3 WHERE dni=$1", values);
                logTS(result.command + " finalizado.");
                return 0;
            }
        } catch (error) {
            console.error("Error al guardar cliente:", error);
            return -1;
        }
    }

    async eliminar() {
        logTS("Eliminando cliente " + this.toString());
        try {
            const result = await pool.query("DELETE FROM cliente WHERE dni=$1;", [this._dni]);
            logTS(result.command + " finalizado.");
        } catch (e) {
            logTS("Error al eliminar cliente.", this.toString(), e);
        }
    }
    

    toString(){
        return `DNI: ${this._dni} - ${this._nombre} - Tel: ${this._telefono}`;
    }
}