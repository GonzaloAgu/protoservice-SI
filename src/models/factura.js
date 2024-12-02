"use strict";

const { logTS } = require('../utils/log');
const pool = require("../utils/pg.js").getInstance();
const MedioPago = require('./medio_pago.js');
const Reparacion = require('./reparacion.js')
const Cliente = require('./cliente.js')

module.exports = class Factura {

    static tipos = ['A', 'B'];
    #id;
    medioPagoObj;
    reparacionObj;
    clienteObj;

    constructor(id = undefined){
        this.#id = id;
        this.tipo = undefined;
        this.fecha = undefined;
        this.monto = undefined;
        this.medio_pago_id = undefined;
    }

    get id() {
        return this.#id;
    }

    async getMedioPagoObj() {
        if(this.medioPagoObj)
            return this.medioPagoObj;
        let mp = new MedioPago(this.medio_pago_id);
        if(await mp.obtener()){
            this.medioPagoObj = mp;
            return mp;
        }
        return false;
    }

    async getReparacionObj() {
        if(this.reparacionObj)
            return this.reparacionObj;
        let rep = new Reparacion(this.medio_pago_id);
        if(await rep.obtener()){
            this.medioPagoObj = mp;
            return mp;
        }
        return false;
    }

    /**
     * Obtiene todos los electrodomésticos de la base.
     * @param {string} query busqueda SQL.
     * @returns array con los resultados
     */
    static async obtenerTodos(query) {
        let result;
        if(query)
            result = (await pool.query("SELECT * FROM factura WHERE " + query)).rows;
        else
            result = (await pool.query("SELECT * FROM factura")).rows;

        if(!result || result.length === 0)
            return [];

        const lista = [];
        result.forEach(item => {
            const obj = new Factura(item.id);
            obj.tipo = item.tipo;
            obj.fecha = item.fecha;
            obj.monto = item.monto;
            obj.medio_pago_id = item.medio_pago_id;
            lista.push(obj);
        });
        return lista;
    }


    /**
     * Busca y obtiene al tipo de electrodoméstico en la base de datos.
     * @returns true si lo encontró, false si no existe.
     */
    async obtener() {
        const result = await pool.query("SELECT * FROM factura WHERE id=$1", [this.#id]);
        if(result.rows.length) {
            this.tipo = result.rows[0].tipo;
            this.fecha = result.rows[0].fecha;
            this.monto = result.rows[0].monto;
            this.medio_pago_id = result.rows[0].medio_pago_id;
            this.medioPagoObj = await this.getMedioPagoObj();
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
            const values = [this.#id, this.tipo, this.fecha, this.monto, this.medio_pago_id];
            const existe = (await pool.query("SELECT * FROM factura WHERE id=$1;", [this.#id])).rows.length == 1;
    
            if (!existe) {
                logTS(`Insertando factura...`);
                const result = await pool.query("INSERT INTO factura(tipo, fecha, monto, medio_pago_id) VALUES($1, $2, $3, $4) RETURNING id"
                        , [this.tipo, this.fecha, this.monto, this.medio_pago_id]);
                this.#id = result.rows[0].id;
                this._id = this.#id;
                logTS(result.command + `  ${this.toString()}` + " finalizado.");
                return 1;
            } else {
                logTS(`Actualizando factura ${this.toString()}...`);
                const result = await pool.query("UPDATE factura SET tipo=$2, fecha=$3, monto=$4, medio_pago_id=$5 WHERE id=$1", values);
                logTS(result.command + " finalizado.");
                return 0;
            }
        } catch (error) {
            console.error("Error al guardar factura:", error);
            return -1;
        }
    }
    /**
     * Elimina objeto de la base de datos
     * @returns true si se elimina correctamente, false en caso contrario.
     */
    async eliminar() {
        logTS("Eliminando factura " + this.toString());
        try {
            const result = await pool.query("DELETE FROM factura WHERE id=$1;", [this.#id]);
            logTS(result.command + " finalizado.");
            return true;
        } catch (e) {
            logTS("Error al eliminar medio de pago.", this.toString(), e);
            return false;
        }
    }

    toString(){
        return `id: ${this.id} tipo ${this.tipo} - ${this.fecha.toString()} - $${this.monto}`;
    }


}