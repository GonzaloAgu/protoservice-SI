"use strict";

const { logTS } = require('../utils/log');
const pool = require("../utils/pg.js").getInstance();
const IModelo = require("./Imodelo.js");
const Cliente = require('./cliente.js');
const Factura = require('./factura.js');

module.exports = class Reparacion extends IModelo {

    #id;
    clienteObj;
    facturaObj;

    static estados = ['pendiente', 'en revisión', 'reparado', 'sin arreglo', 'no disponible', 'abandonado'];
    
    constructor(id){
        super();
        this.#id = id;
        this.modelo_electro = null;
        this.desc_falla = null;
        this.fecha_recepcion;
        this.id_cliente;
        this.factura_id;
        this.estado;
    }

    get id() {
        return this.#id;
    }


    async getClienteObj(){
        if(this.clienteObj)
            return this.clienteObj;
        let cliente = new Cliente(this.id_cliente);
        if(await cliente.obtener()){
            this.clienteObj = cliente;
            return cliente;
        }
        return false;
    }

    async getFacturaObj() {
        if(this.facturaObj) return this.facturaObj;
        let factura = new Factura(this.factura_id);
        if(await factura.obtener()){
            this.facturaObj = factura;
            return factura;
        }
        return false;
    }
    /**
     * Busca reparaciones en base a término de búsqueda ingresado
     * @param {*} termino 
     * @returns resultado de query
     */
    static async buscarPorPalabra(termino){
        function isNumeric(str) {
            if (typeof str != "string") return false // we only process strings!  
            return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
                   !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
          }
          let query = `SELECT Rx.id, Cx.id, Cx.nombre, Fx.descripcion AS marca, Rx.modelo_electro,
          Rx.fecha_recepcion,Rx.desc_falla, Rx.estado
          FROM reparacion Rx
          JOIN cliente Cx ON Rx.id_cliente = Cx.id
          JOIN fabricante Fx ON Rx.fabricante_id = Fx.id
          WHERE Cx.nombre ILIKE $1 OR Rx.modelo_electro ILIKE $1
          OR Fx.descripcion ILIKE $1 OR Rx.desc_falla ILIKE $1`;
      
          if(isNumeric(termino)){
            query += ` OR Cx.id::TEXT LIKE $1`
          }
          query += ' ORDER BY Rx.fecha_recepcion, Cx.nombre;'
      
          let result = (await pool.query(query, ['%' + termino + '%']))
          return result;
    }
    
    /**
     * Obtiene todas las reparaciones de la base.
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
        result.forEach( item => {
            const obj = new Reparacion(item.id);
            obj.modelo_electro = item.modelo_electro;
            obj.desc_falla = item.desc_falla;
            obj.fecha_recepcion = item.fecha_recepcion;
            obj.id_cliente = item.id_cliente;
            
            obj.factura_id = item.factura_id;
            obj.estado = item.estado;
            lista.push(obj);
        });
        
        return lista;
    }


    /**
     * Busca y obtiene a la reparación en la base de datos.
     * @returns true si lo encontró, false si no existe.
     */
    async obtener() {
        const result = await pool.query("SELECT * FROM reparacion WHERE id=$1", [this.#id]);
        
        if(result.rows.length) {
            this.modelo_electro = result.rows[0].modelo_electro;
            this.desc_falla = result.rows[0].desc_falla;
            this.fecha_recepcion = result.rows[0].fecha_recepcion;
            this.id_cliente = result.rows[0].id_cliente;
            this.clienteObj = await this.getClienteObj();
            this.factura_id = result.rows[0].factura_id;
            this.estado = result.rows[0].estado;
            return true;
        }
        return false;
    }

     /**
     * Almacena datos de la reparación en la base de datos. Si no existia, lo agrega.
     * @returns 1 si lo agrego en la base. 0 si lo modifico. -1 si se produjo un error.
     */
    async guardar() {
        try {
            const values = [this.modelo_electro, this.desc_falla, this.fecha_recepcion, this.id_cliente, this.factura_id, this.estado];
            const existe = (await pool.query("SELECT * FROM reparacion WHERE id=$1;", [this.#id])).rows.length == 1;
    
            if (!existe) {
                logTS(`Insertando reparación...`);
                const result = await pool.query("INSERT INTO reparacion(modelo_electro, desc_falla, fecha_recepcion, id_cliente, factura_id, estado) VALUES($1, $2, $3, $4, $5, $6) RETURNING id", values);
                this.#id = result.rows[0].id;
                this.clienteObj = await this.getClienteObj();
                logTS(result.command + ` ${this.toString()}` +  " finalizado.");
                return 1;
            } else {
                logTS(`Actualizando reparacion ${this.toString()}...`);
                const result = await pool.query("UPDATE reparacion SET modelo_electro=$2, desc_falla=$3, fecha_recepcion=$4, id_cliente=$5, factura_id=$6, estado=$7 WHERE id=$1", [this.#id].concat(values));
                logTS(result.command + " finalizado.");
                return 0;
            }
        } catch (error) {
            console.error("Error al guardar reparacion:", error);
            return -1;
        }
    }
    /**
     * Elimina objeto de la base de datos
     * @returns true si se elimina correctamente, false en caso contrario.
     */
    async eliminar() {
        logTS("Eliminando reparación " + this.toString());
        try {
            const result = await pool.query("DELETE FROM reparacion WHERE id=$1;", [this.#id]);
            logTS(result.command + " finalizado.");
            return 1;
        } catch (e) {
            logTS("Error al eliminar reparación.", this.toString(), e);
        }
    }

    toString(){
        if(this.id_cliente)
            return `[id ${this.#id}] - Cliente: ${this.clienteObj.nombre} [id ${this.id_cliente}]`;
        else
            return `id: ${this.#id}`;
    }
}