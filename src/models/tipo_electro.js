const { logTS } = require('../utils/log');
const pool = require("../controllers/pg").getInstance();
const { IModelo } = require("./models");

module.exports = class TipoElectrodomestico extends IModelo {
    constructor(id) {
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
     * Obtiene todos los tipos de electrodomésticos de la base.
     * @returns array con los resultados.
     */
    static async obtenerTodos() {
        return await pool.query("SELECT * FROM tipo_electro").rows;
    }

    /**
     * Obtiene todos los tipos de electrodomésticos de la base.
     * @returns array con los resultados.
     */
    static async obtenerTodos(query) {
        return await pool.query("SELECT * FROM tipo_electro WHERE ", query).rows;
    }

    /**
     * Busca y obtiene al tipo de electrodoméstico en la base de datos.
     * @returns true si lo encontró, false si no existe.
     */
    async obtener() {
        const result = await pool.query("SELECT descripcion FROM tipo_electro WHERE id=$1", [this._id]);
        if(result.rows.length) {
            this._descripcion = result.rows[0].descripcion;
            return true;
        }
        return false;
    }

     /**
     * Almacena datos del tipo de electrodomestico en la base de datos. Si no existia, lo agrega.
     * @returns 1 si lo agrego en la base. 0 si lo modifico. -1 si se produjo un error.
     */
    async guardar() {
        try {
            const values = [this._id, this._descripcion];
            const existe = (await pool.query("SELECT * FROM tipo_electro WHERE id=$1;", [this._id])).rows.length == 1;
    
            if (!existe) {
                logTS(`Insertando tipo de electrodoméstico ${this.toString()}...`);
                const result = await pool.query("INSERT INTO tipo_electro(descripcion) VALUES($2)", values);
                logTS(result.command + " finalizado.");
                return 1;
            } else {
                logTS(`Actualizando tipo de electrodoméstico ${this.toString()}...`);
                const result = await pool.query("UPDATE tipo_electro SET descripcion=$2 WHERE id=$1", values);
                logTS(result.command + " finalizado.");
                return 0;
            }
        } catch (error) {
            console.error("Error al guardar tipo de electrodoméstico:", error);
            return -1;
        }
    }

}