"use strict";

const { logTS } = require('../utils/log');
const pool = require("../utils/pg.js").getInstance();
const Fabricante = require('./fabricante.js');
const Cliente = require('./cliente.js');
const Factura = require('./factura.js');
const Comentario = require('./comentario.js');
const TipoElectrodomestico = require('./tipo_electro.js');


module.exports = class Reparacion {


    clienteObj;
    facturaObj;
    fabricanteObj;
    tipoElectroObj;
    comentarios = null;

    static estados = ['pendiente', 'en revision', 'reparado', 'sin arreglo'];

    constructor(id) {
        this.id = id;
        this.modelo_electro = null;
        this.desc_falla = null;
        this.fecha_recepcion;
        this.tipo_electro_id;
        this.fabricante_id;
        this.id_cliente;
        this.factura_id;
        this.estado;
    }

    async getClienteObj() {
        if (this.clienteObj)
            return this.clienteObj;
        let cliente = new Cliente(this.id_cliente);
        if (await cliente.obtener()) {
            this.clienteObj = cliente;
            return cliente;
        }
        return false;
    }
    static async getFromFacturaId(factura_id) {
        const result = await pool.query("SELECT id FROM reparacion WHERE factura_id=$1", [factura_id])
        const reparacion = new Reparacion(result.rows[0].id)
        await reparacion.obtener()

        if(reparacion.desc_falla)
            return reparacion
        throw new Error("No se encontró una reparación con una factura de id: ", factura_id)
    }

    async getFabricanteObj() {
        if (this.fabricanteObj) return this.fabricanteObj;
        let fabricante = new Fabricante(this.fabricante_id);
        if (await fabricante.obtener()) {
            this.fabricanteObj = fabricante;
            return fabricante;
        }
        return false;
    }

    async getTipoElectroObj() {
        if (this.tipoElectroObj) return this.tipoElectroObj;
        let tipo = new TipoElectrodomestico(this.tipo_electro_id);
        if (await tipo.obtener()) {
            this.tipoElectroObj = tipo;
            return tipo;
        }
        throw new Error("No se encontro el tipo de electrodomestico N°" + this.tipo_electro_id);
    }

    async getFacturaObj() {
        if (this.facturaObj) return this.facturaObj;
        let factura = new Factura(this.factura_id);
        if (await factura.obtener()) {
            this.facturaObj = factura;
            return factura;
        }
        return false;
    }

    async getComentarios() {
        if (this.comentarios !== null) return this.comentarios;
        this.comentarios = [];
        const result = (await pool.query("SELECT * FROM comentario WHERE id_reparacion=$1", [this.id]));
        result.rows.forEach(data => {
            const comentario = new Comentario(data.id);
            comentario.texto = data.texto;
            comentario.fecha = data.fecha;
            comentario.id_reparacion = data.id_reparacion;
            this.comentarios.push(comentario);
        })
        return this.comentarios;
    }


    /**
     * Busca reparaciones en base a término de búsqueda ingresado
     * @param {*} termino 
     * @returns resultado de query
     */
    static async buscarPorPalabra(termino) {
        function isNumeric(str) {
            if (typeof str != "string") return false // we only process strings!  
            return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
                !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
        }
        let query = `SELECT Rx.id, Rx.id_cliente, Cx.nombre, Fx.id AS fabricante_id, Rx.modelo_electro,
          Rx.fecha_recepcion,Rx.desc_falla, Rx.estado
          FROM reparacion Rx
          JOIN cliente Cx ON Rx.id_cliente = Cx.id
          JOIN fabricante Fx ON Rx.fabricante_id = Fx.id
          WHERE Cx.nombre ILIKE $1 OR Rx.modelo_electro ILIKE $1
          OR Fx.descripcion ILIKE $1 OR Rx.desc_falla ILIKE $1`;

        if (isNumeric(termino)) {
            query += ` OR Cx.id::TEXT LIKE $1`
        }
        query += ' ORDER BY Rx.id;'

        let result = (await pool.query(query, ['%' + termino + '%']))

        const lista = [];
        result.rows.forEach(item => {
            const obj = new Reparacion(item.id);
            obj.modelo_electro = item.modelo_electro;
            obj.desc_falla = item.desc_falla;
            obj.fecha_recepcion = item.fecha_recepcion;
            obj.id_cliente = item.id_cliente;
            obj.fabricante_id = item.fabricante_id;
            obj.tipo_electro_id = item.tipo_electro_id;
            obj.factura_id = item.factura_id;
            obj.estado = item.estado;
            lista.push(obj);
        });

        return lista;
    }

    /**
     * Obtiene todas las reparaciones de la base.
     * @returns array con los resultados
     */
    static async obtenerTodos(query) {
        let result;
        if (query)
            result = (await pool.query("SELECT * FROM reparacion WHERE " + query +' ORDER BY reparacion.id;')).rows;
        else
            result = (await pool.query("SELECT * FROM reparacion ORDER BY reparacion.id;")).rows;

        if (!result || result.length === 0)
            return [];

        const lista = [];
        result.forEach(item => {
            const obj = new Reparacion(item.id);
            obj.modelo_electro = item.modelo_electro;
            obj.desc_falla = item.desc_falla;
            obj.fecha_recepcion = item.fecha_recepcion;
            obj.id_cliente = item.id_cliente;
            obj.fabricante_id = item.fabricante_id;
            obj.tipo_electro_id = item.tipo_electro_id;
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
        try {
            const result = await pool.query("SELECT * FROM reparacion WHERE id=$1", [this.id]);
    
            if (result.rows.length) {
                this.modelo_electro = result.rows[0].modelo_electro;
                this.desc_falla = result.rows[0].desc_falla;
                this.fecha_recepcion = result.rows[0].fecha_recepcion;
                this.id_cliente = result.rows[0].id_cliente;
                this.clienteObj = await this.getClienteObj();
                this.fabricante_id = result.rows[0].fabricante_id;
                this.fabricanteObj = await this.getFabricanteObj();
                this.factura_id = result.rows[0].factura_id;
                this.estado = result.rows[0].estado;
                return true;
            }
            return false;
        } catch (e) {
            console.log(e);
        }
    }

    /**
    * Almacena datos de la reparación en la base de datos. Si no existia, lo agrega.
    * @returns 1 si lo agrego en la base. 0 si lo modifico. -1 si se produjo un error.
    */
    async guardar() {
        try {
            const values = [this.modelo_electro, this.desc_falla, this.id_cliente, this.factura_id, this.estado, this.tipo_electro_id, this.fabricante_id];
            const existe = (await pool.query("SELECT * FROM reparacion WHERE id=$1;", [this.id])).rows.length == 1;

            if (!existe) {
                logTS(`Insertando reparación...`);
                const result = await pool.query("INSERT INTO reparacion(modelo_electro, desc_falla, id_cliente, factura_id, estado, tipo_electro_id, fabricante_id) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id", values);
                this.id = result.rows[0].id;
                this.clienteObj = await this.getClienteObj();
                logTS(result.command + ` ${this.toString()}` + " finalizado.");
                return 1;
            } else {
                logTS(`Actualizando reparacion ${this.toString()}...`);
                const result = await pool.query("UPDATE reparacion SET modelo_electro=$2, desc_falla=$3, id_cliente=$4, factura_id=$5, estado=$6, tipo_electro_id=$7, fabricante_id=$8 WHERE id=$1", [this.id].concat(values));
                logTS(result.command + " finalizado.");
                return 0;
            }
        } catch (error) {
            console.error("Error al guardar reparacion:", error);
            return error;
        }
    }
    /**
     * Elimina objeto de la base de datos
     * @returns true si se elimina correctamente, false en caso contrario.
     */
    async eliminar() {
        logTS("Eliminando reparación " + this.toString());
        try {
            const result = await pool.query("DELETE FROM reparacion WHERE id=$1;", [this.id]);
            logTS(result.command + " finalizado.");
            return 1;
        } catch (e) {
            logTS("Error al eliminar reparación.", this.toString(), e);
        }
    }

    toString() {
        if (this.id_cliente)
            return `[id ${this.id}] - Cliente: ${this.clienteObj.nombre} [id ${this.id_cliente}]`;
        else
            return `id: ${this.id}`;
    }
}