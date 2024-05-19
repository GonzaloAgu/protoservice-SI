const { logTS } = require('../utils/log');
const pool = require("../controllers/pg").getInstance();
const IModelo = require("./Imodelo.js");

module.exports = class Reparacion extends IModelo {

    #id;
    static estados = ['pendiente', 'en revisión', 'reparado', 'sin arreglo', 'no disponible', 'abandonado'];
    
    constructor(id){
        super();
        this.#id = id;
        this.electrodomestico_id = null;
        this.desc_falla = null;
        this.fecha_recepcion;
        this.dni_cliente;
        this.factura_id;
        this.estado;
    }

    get id() {
        return this.#id;
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
            obj.electrodomestico_id = item.electrodomestico_id;
            obj.desc_falla = item.desc_falla;
            obj.fecha_recepcion = item.fecha_recepcion;
            obj.dni_cliente = item.dni_cliente;
            obj.factura_id = item.factura_id;
            obj.estado = item.estado;
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