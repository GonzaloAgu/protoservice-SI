const { logTS } = require('../utils/log');
const pool = require("../controllers/pg").getInstance();
const IModelo = require("./Imodelo.js");

module.exports = class MedioPago extends IModelo {
    #id;
    
    constructor(id) {
        super();
        this.#id = id;
        this.descripcion = undefined;
    }

    get id() {
        return this.#id;
    }

    /**
     * Obtiene todos los medios de pago de la base.
     * @returns array con los resultados.
     */
    
    /**
     * Obtiene todos los medios de pago de la base.
     * @param {string} query busqueda SQL.
     * @returns array con los resultados.
     */
    static async obtenerTodos(query) {
        let result;
        if(query)
            result = (await pool.query("SELECT * FROM medio_pago WHERE " + query)).rows;
        else
            result = (await pool.query("SELECT * FROM medio_pago")).rows;

        if(!result || result.length === 0)
            return [];

        const lista = [];
        result.forEach(item => {
            const obj = new MedioPago(item.id);
            obj._id = item.id;
            obj.descripcion = item.descripcion;
            lista.push(obj);
        });
        return lista;
    }

    /**
     * Busca y obtiene al medio de pago en la base de datos.
     * @returns true si lo encontró, false si no existe.
     */
    async obtener() {
        const result = await pool.query("SELECT * FROM medio_pago WHERE id=$1", [this.#id]);
        if(result.rows.length) {
            this.descripcion = result.rows[0].descripcion;
            return true;
        }
        return false;
    }

     /**
     * Almacena datos del medio de pago en la base de datos. Si no existia, lo agrega.
     * @returns 1 si lo agrego en la base. 0 si lo modifico. -1 si se produjo un error.
     */
    async guardar() {
        try {
            const values = [this.#id, this.descripcion];
            const existe = (await pool.query("SELECT * FROM medio_pago WHERE id=$1;", [this.#id])).rows.length == 1;
    
            if (!existe) {
                logTS(`Insertando medio de pago...`);
                const result = await pool.query("INSERT INTO medio_pago(descripcion) VALUES($1) RETURNING id", [this.descripcion]);
                this.#id = result.rows[0].id;
                logTS(result.command + `  ${this.toString()}` + " finalizado.");
                return 1;
            } else {
                logTS(`Actualizando medio de pago ${this.toString()}...`);
                const result = await pool.query("UPDATE medio_pago SET descripcion=$2 WHERE id=$1", values);
                logTS(result.command + " finalizado.");
                return 0;
            }
        } catch (error) {
            console.error("Error al guardar medio de pago:", error);
            return -1;
        }
    }
    /**
     * Elimina objeto de la base de datos
     * @returns true si se elimina correctamente, false en caso contrario.
     */
    async eliminar() {
        logTS("Eliminando medio de pago " + this.toString());
        try {
            const result = await pool.query("DELETE FROM medio_pago WHERE id=$1;", [this.#id]);
            logTS(result.command + " finalizado.");
            return true;
        } catch (e) {
            logTS("Error al eliminar medio de pago.", this.toString(), e);
            return false;
        }
    }

    toString() {
        return `ID: ${this.id} - ${this.descripcion}`;
    }

}