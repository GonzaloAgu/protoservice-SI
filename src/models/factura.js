const { logTS } = require('../utils/log');
const pool = require("../controllers/pg").getInstance();
const IModelo = require("./Imodelo.js");

module.exports = class Factura extends IModelo {

    static tipos = ['A', 'B'];

    constructor(id){
        this._id = id;
        this._tipo = undefined;
        this._fecha = undefined;
        this._monto = undefined;
        this._medio_pago_id = undefined;
    }

    get id() {
        return this._id;
    }

    get tipo() {
        return this._tipo;
    }

    set tipo(t) {
        this._tipo = t;
    }

    get fecha() {
        return this._fecha;
    }

    set fecha(t) {
        this._fecha = t;
    }
    get monto() {
        return this._monto;
    }

    set monto(t) {
        this._monto = t;
    }
    get medio_pago_id() {
        return this._medio_pago_id;
    }

    set medio_pago_id(t) {
        this._medio_pago_id = t;
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
        const result = await pool.query("SELECT * FROM medio_pago WHERE id=$1", [this._id]);
        if(result.rows.length) {
            this._tipo = result.rows[0].tipo;
            this._fecha = result.rows[0].fecha;
            this._monto = result.rows[0].monto;
            this._medio_pago_id = result.rows[0].medio_pago_id;
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
            const values = [this._id, this._tipo, this._fecha, this._monto, this._medio_pago_id];
            const existe = (await pool.query("SELECT * FROM factura WHERE id=$1;", [this._id])).rows.length == 1;
    
            if (!existe) {
                logTS(`Insertando factura ${this.toString()}...`);
                const result = await pool.query("INSERT INTO factura(tipo, fecha, monto, medio_pago_id) VALUES($1, $2, $3, $4) RETURNING id", [this.descripcion]);
                this._id = result.rows[0].id;
                logTS(result.command + " finalizado.");
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
            const result = await pool.query("DELETE FROM factura WHERE id=$1;", [this._id]);
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