const { logTS } = require('../utils/log');
const pool = require("../controllers/pg").getInstance();
const IModelo = require("./Imodelo.js");

module.exports = class Reparacion extends IModelo {

    static estados = ['pendiente', 'en revisión', 'reparado', 'sin arreglo', 'no disponible', 'abandonado'];
    
    get id() {
        return this._id;
    }
    get electrodomestico_id() {
        return this._electrodomestico_id;
    }
    set electrodomestico_id(e) {
        this._electrodomestico_id = e;
    }
    get desc_falla() {
        return this._desc_falla;
    }
    set desc_falla(e) {
        this._desc_falla = e;
    }
    get fecha_recepcion() {
        return this._fecha_recepcion;
    }
    set fecha_recepcion(e) {
        this._fecha_recepcion = e;
    }
    get dni_cliente() {
        return this._dni_cliente;
    }
    set dni_cliente(e) {
        this._dni_cliente = e;
    }
    get factura_id() {
        return this._factura_id;
    }
    set factura_id(e) {
        this._factura_id = e;
    }
    get estado() {
        return this._estado;
    }
    set estado(e) {
        this._estado = e;
    }
    
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