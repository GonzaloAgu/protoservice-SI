"use strict";

const { logTS } = require('../utils/log');
const pool = require("../utils/pg.js").getInstance();

module.exports = class Comentario {

    id;
    texto;
    fecha;
    id_reparacion;

    constructor(id) {
        this.id = id;
    }

    /**
     * Obtiene todos los comentarios de la base.
     * @returns array con los resultados.
     */
    static async obtenerTodos(query) {
        let result;
        if(query)
            result = (await pool.query("SELECT * FROM comentario WHERE " + query)).rows;
        else
            result = (await pool.query("SELECT * FROM comentario")).rows;

        if(!result || result.length === 0)
            return [];

        const lista = [];
        result.forEach(item => {
            const obj = new Comentario(item.id);
            obj.texto = item.texto;
            obj.fecha = item.fecha;
            obj.id_reparacion = item.id_reparacion;
            lista.push(obj);
        });

        lista.sort((a, b) => {
            return a.fecha.localeCompare(b.fecha);
        })

        return lista;
    }

    /**
     * Busca y obtiene al comentario en la base de datos.
     * @returns true si lo encontró, false si no existe.
     */
    async obtener() {
        const result = await pool.query("SELECT * FROM comentario WHERE id=$1", [this.id]);
        if(result.rows.length) {
            this.texto = result.rows[0].texto;
            this.fecha = result.rows[0].fecha;
            this.id_reparacion = result.rows[0].id_reparacion;
            return true;
        }
        return false;
    }

     /**
     * Almacena datos del comentario en la base de datos. Si no existia, lo agrega.
     * @returns 1 si lo agrego en la base. 0 si lo modifico. -1 si se produjo un error.
     */
    async guardar() {
        try {
            const values = [this.id, this.texto, this.fecha];
            const existe = (await pool.query("SELECT * FROM comentario WHERE id=$1;", [this.id])).rows.length == 1;
    
            if (!existe) {
                logTS(`Insertando comentario...`);
                const result = await pool.query("INSERT INTO comentario(texto, fecha, id_reparacion) VALUES($1, $2, $3) RETURNING id", [this.descripcion]);
                this.id = result.rows[0].id;
                logTS(result.command + `  ${this.toString()}` + " finalizado.");
                return 1;
            } else {
                logTS(`Actualizando comentario ${this.toString()}...`);
                const result = await pool.query("UPDATE comentario SET texto=$2, fecha=$3, id_reparacion=$4 WHERE id=$1", values);
                logTS(result.command + " finalizado.");
                return 0;
            }
        } catch (error) {
            console.error("Error al guardar comentario:", error);
            return -1;
        }
    }

    async eliminar() {
        logTS("Eliminando comentario " + this.toString());
        try {
            const result = await pool.query("DELETE FROM comentario WHERE id=$1;", [this.id]);
            logTS(result.command + " finalizado.");
            return 1;
        } catch (e) {
            logTS("Error al eliminar comentario.", this.toString(), e);
        }
    }

    toString() {
        return `ID: ${this.id} - ${this.texto}`;
    }

}