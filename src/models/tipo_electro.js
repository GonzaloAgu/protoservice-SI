"use strict";

const { logTS } = require('../utils/log');
const pool = require("../utils/pg.js").getInstance();

module.exports = class TipoElectrodomestico {
    
    #id;
    constructor(id) {
        this.#id = id;
        this.descripcion = undefined;
    }

    get id() {
        return this.#id;
    }

    /**
     * Obtiene todos los tipos de electrodomésticos de la base.
     * @returns array con los resultados.
     */
    static async obtenerTodos(query) {
        let result;
        if(query)
            result = (await pool.query("SELECT * FROM tipo_electro WHERE " + query)).rows;
        else
            result = (await pool.query("SELECT * FROM tipo_electro")).rows;

        if(!result || result.length === 0)
            return [];

        const lista = [];
        result.forEach(item => {
            const obj = new TipoElectrodomestico(item.id);
            obj.descripcion = item.descripcion;
            lista.push(obj);
        });

        lista.sort((a, b) => {
            return a.descripcion.localeCompare(b.descripcion);
        })

        return lista;
    }

    /**
     * Busca y obtiene al tipo de electrodoméstico en la base de datos.
     * @returns true si lo encontró, false si no existe.
     */
    async obtener() {
        const result = await pool.query("SELECT * FROM tipo_electro WHERE id=$1", [this.#id]);
        if(result.rows.length) {
            this.descripcion = result.rows[0].descripcion;
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
            const values = [this.#id, this.descripcion];
            const existe = (await pool.query("SELECT * FROM tipo_electro WHERE id=$1;", [this.#id])).rows.length == 1;
    
            if (!existe) {
                logTS(`Insertando tipo de electrodoméstico...`);
                const result = await pool.query("INSERT INTO tipo_electro(descripcion) VALUES($1) RETURNING id", [this.descripcion]);
                this.#id = result.rows[0].id;
                logTS(result.command + `  ${this.toString()}` + " finalizado.");
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

    async eliminar() {
        logTS("Eliminando tipo de electrodoméstico " + this.toString());
        try {
            const result = await pool.query("DELETE FROM tipo_electro WHERE id=$1;", [this.#id]);
            logTS(result.command + " finalizado.");
            return 1;
        } catch (e) {
            logTS("Error al eliminar tipo de electrodomestico.", this.toString(), e);
        }
    }

    toString() {
        return `ID: ${this.id} - ${this.descripcion}`;
    }

}