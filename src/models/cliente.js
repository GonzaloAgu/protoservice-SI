const { logTS } = require('../utils/log');
const pool = require("../controllers/pg").getInstance();
const IModelo = require("./Imodelo.js");


module.exports = class Cliente extends IModelo {
    constructor(dni) {
        super();
        this._dni = dni;
        this._nombre = null;
        this._telefono = null;
    }
    
    get dni(){
        return this._dni;
    }

    get nombre() {
        return this._nombre;
    }

    get telefono() {
        return this._telefono;
    }

    set nombre(nombre){
        this._nombre = nombre;
    }

    set telefono(tel){
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
     * Obtiene todos los clientes de la base.
     * @returns array con los clientes
     */
    static async obtenerTodos(query) {
        let result;
        if(query)
            result = (await pool.query("SELECT * FROM cliente WHERE " + query)).rows;
        else
            result = (await pool.query("SELECT * FROM cliente")).rows;

        if(!result || result.length === 0)
            return [];

        const lista = [];
        result.forEach(item => {
            const obj = new Cliente(item.id);
            obj.descripcion = item.descripcion;
            lista.push(obj);
        });
        return lista;
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
            return 1;
        } catch (e) {
            logTS("Error al eliminar cliente.", this.toString(), e);
        }
    }

    toString(){
        return `DNI: ${this._dni} - ${this._nombre} - Tel: ${this._telefono}`;
    }
}