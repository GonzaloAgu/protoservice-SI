"use strict";

const { logTS } = require('../utils/log');
const pool = require("../utils/pg.js").getInstance();


module.exports = class Cliente  {
    
    constructor(id) {
        this.id = id;
        this.nombre = null;
        this.telefono = null;
    }
    
    /**
     * Busca y obtiene al cliente en la base de datos.
     * @returns true si lo encontró, false si no existe.
     */
    async obtener(){
        let result = await pool.query("SELECT * FROM cliente WHERE id=$1;", [this.id]);
        if(result.rows.length){
            const cliente = result.rows[0];
            this.id = cliente.id;
            this.nombre = cliente.nombre;
            this.telefono = cliente.telefono;
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
            obj.telefono = item.telefono;
            obj.nombre = item.nombre;
            lista.push(obj);
        });
        return lista;
    }

    static async getFromFacturaId(factura_id) {
        const result = await pool.query("SELECT cliente.id FROM cliente JOIN reparacion ON cliente.id=reparacion.id_cliente JOIN factura ON reparacion.factura_id = factura.id WHERE factura_id=$1", [factura_id])
        const cliente = new Cliente(result.rows[0].id)
        await cliente.obtener()

        if(cliente.nombre)
            return cliente
        throw new Error("No se encontró un cliente para el cual exista una factura de id: ", factura_id)
    }

    /**
     * Almacena datos del cliente en la base de datos. Si no existia, lo agrega.
     * @returns 1 si lo agrego en la base. 0 si lo modifico. -1 si se produjo un error.
     */
    async guardar() {
        try {
            const values = [this.nombre, this.telefono];
            const existe = (await pool.query("SELECT * FROM cliente WHERE id=$1;", [this.id])).rows.length == 1;
    
            if (!this.id || !existe) {
                logTS(`Insertando cliente ${this.toString()}...`);
                const result = await pool.query("INSERT INTO cliente(nombre, telefono) VALUES($1, $2) RETURNING id", values);
                logTS(result.command + " finalizado.");
                this.id = result.rows[0].id;
                return 1;
            } else {
                logTS(`Actualizando cliente ${this.toString()}...`);
                const result = await pool.query("UPDATE cliente SET nombre=$2, telefono=$3 WHERE id=$1", [this.id].concat(values));
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
            const result = await pool.query("DELETE FROM cliente WHERE id=$1;", [this.id]);
            logTS(result.command + " finalizado.");
            return 1;
        } catch (e) {
            logTS("Error al eliminar cliente.", this.toString(), e);
        }
    }

    toString(){
        return `id: ${this.id} - ${this.nombre} - Tel: ${this.telefono}`;
    }
}