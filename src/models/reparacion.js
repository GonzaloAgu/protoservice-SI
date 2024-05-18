const { logTS } = require('../utils/log');
const pool = require("../controllers/pg").getInstance();
const IModelo = require("./Imodelo.js");

module.exports = class Reparacion extends IModelo {
    constructor(){
        super();
        this._id = null;
        this._electrodomestico_id = null;
        this._desc_falla = null;
        this._fecha_recepcion;
        this._dni_cliente;
        this._factura_id;
        this._estado;
    }


    /**
     * Obtiene todos los electrodomésticos de la base.
     * @returns array con los resultados
     */
    static async obtenerTodos(query) {
        let result;
        if(query)
            result = (await pool.query("SELECT * FROM reparacion WHERE " + query)).rows;
        else
            result = (await pool.query("SELECT * FROM reparacion")).rows;

        if(!result || result.length === 0)
            return [];

        const lista = [];
        result.forEach(item => {
            const obj = new Reparacion(item.id);
            obj.descripcion = item.descripcion;
            lista.push(obj);
        });
        return lista;
    }


    /**
     * Busca y obtiene al tipo de electrodoméstico en la base de datos.
     * @returns true si lo encontró, false si no existe.
     */
    async obtener() {
        throw "Metodo obtener no implementado."
    }

     /**
     * Almacena datos del tipo de electrodomestico en la base de datos. Si no existia, lo agrega.
     * @returns 1 si lo agrego en la base. 0 si lo modifico. -1 si se produjo un error.
     */
    async guardar() {
        throw "Metodo guardar no implementado."
    }
    /**
     * Elimina objeto de la base de datos
     * @returns true si se elimina correctamente, false en caso contrario.
     */
    async eliminar() {
        throw "Metodo eliminar no implementado.";
    }

    toString(){
        throw "Metodo toString no implementado.";
    }
}