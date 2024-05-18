const { logTS } = require('../utils/log');
const pool = require("../controllers/pg").getInstance();
const IModelo = require("./Imodelo.js");

module.exports = class Fabricante extends IModelo {
    constructor(id){
        super();
        this._id = id;
        this._descripcion = undefined;
    }

    get id() {
        return this._id;
    }

    get descripcion() {
        return this._descripcion;
    }

    set descripcion(desc) {
        this._descripcion = desc;
    }

    /**
     * Busca y obtiene al fabricante en la base de datos.
     * @returns true si lo encontró, false si no existe.
     */
    async obtener(){
        let result = await pool.query("SELECT * FROM fabricante WHERE id=$1;", [this._id]);
        if(result.rows.length){
            this._descripcion = result.rows[0].descripcion;
            return true;
        }
        return false;
    }

    /**
     * Obtiene todos los fabricantes de la base.
     * @returns array con los resultados.
     */
    static async obtenerTodos(query) {
        let result;
        if(query)
            result = (await pool.query("SELECT * FROM fabricante WHERE " + query)).rows;
        else
            result = (await pool.query("SELECT * FROM fabricante")).rows;

        if(!result || result.length === 0)
            return [];

        const lista = [];
        result.forEach(item => {
            const obj = new Fabricante(item.id);
            obj.descripcion = item.descripcion;
            lista.push(obj);
        });
        return lista;
    }

    /**
     * Almacena datos del fabricante en la base de datos. Si no existia, lo agrega.
     * @returns 1 si lo agrego en la base. 0 si lo modifico. -1 si se produjo un error.
     */
    async guardar() {
        try {
            const values = [this._id || -1, this._descripcion];
            const existe = (await pool.query("SELECT * FROM fabricante WHERE id=$1;", [this._id])).rows.length == 1;
    
            if (!existe) {
                logTS(`Insertando fabricante ${this.toString()}...`);
                const result = await pool.query("INSERT INTO fabricante(descripcion) VALUES($1) RETURNING id;", [this._descripcion]);
                this._id = result.rows[0].id;
                logTS(result.command + " finalizado.");
                return 1;
            } else {
                logTS(`Actualizando fabricante ${this.toString()}...`);
                const result = await pool.query("UPDATE fabricante SET descripcion=$2 WHERE id=$1", values);
                logTS(result.command + " finalizado.");
                return 0;
            }
        } catch (error) {
            console.error("Error al guardar fabricante:", error);
            return -1;
        }
    }

    async eliminar() {
        logTS("Eliminando fabricante " + this.toString());
        try {
            const result = await pool.query("DELETE FROM fabricante WHERE id=$1;", [this._id]);
            logTS(result.command + " finalizado.");
            return 1;
        } catch (e) {
            logTS("Error al eliminar faricante.", this.toString(), e);
        }
    }
    

    toString(){
        return `ID: ${this._id} - ${this._descripcion}`;
    }
}