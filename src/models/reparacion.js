const { logTS } = require('../utils/log');
const pool = require("../controllers/pg").getInstance();
const IModelo = require("./Imodelo.js");
//const Cliente = require('./cliente.js')
const { Cliente, Electrodomestico, Factura } = require('./models.js');
module.exports = class Reparacion extends IModelo {

    #id;
    clienteObj;
    electrodomesticoObj;
    facturaObj;

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


    async getClienteObj(){
        let cliente = new Cliente(this.dni_cliente);
        if(await cliente.obtener())
            return cliente;
        return false;
    }

    async getElectrodomesticoObj() {
        let electro = new Electrodomestico(this.electrodomestico_id);
        if(await electro.obtener())
            return electro;
        return false;
    }

    async getFacturaObj() {
        let factura = new Factura(this.factura_id);
        if(await factura.obtener())
            return factura;
        return false;
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
        result.forEach( item => {
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
        const result = await pool.query("SELECT * FROM reparacion WHERE id=$1", [this.#id]);
        
        if(result.rows.length) {
            this.electrodomestico_id = result.rows[0].electrodomestico_id;
            this.electrodomesticoObj = new Electrodomestico(this.electrodomestico_id);
            await this.electrodomesticoObj.obtener();
            this.desc_falla = result.rows[0].desc_falla;
            this.fecha_recepcion = result.rows[0].fecha_recepcion;
            this.dni_cliente = result.rows[0].dni_cliente;
            this.clienteObj = new Cliente(this.dni_cliente);
            await this.clienteObj.obtener();
            this.factura_id = result.rows[0].factura_id;
            this.estado = result.rows[0].estado;
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
            const values = [this.electrodomestico_id, this.desc_falla, this.fecha_recepcion, this.dni_cliente, this.factura_id, this.estado];
            const existe = (await pool.query("SELECT * FROM reparacion WHERE id=$1;", [this.#id])).rows.length == 1;
    
            if (!existe) {
                logTS(`Insertando reparación...`);
                const result = await pool.query("INSERT INTO reparacion(electrodomestico_id, desc_falla, fecha_recepcion, dni_cliente, factura_id, estado) VALUES($1, $2, $3, $4, $5, $6) RETURNING id", values);
                this.#id = result.rows[0].id;
                this.clienteObj = await this.getClienteObj();
                this.electrodomesticoObj = await this.getElectrodomesticoObj();
                logTS(result.command + ` ${this.toString()}` +  " finalizado.");
                return 1;
            } else {
                logTS(`Actualizando reparacion ${this.toString()}...`);
                const result = await pool.query("UPDATE reparacion SET electrodomestico_id=$2, desc_falla=$3, fecha_recepcion=$4, dni_cliente=$5, factura_id=$6, estado=$7 WHERE id=$1", [this.#id].concat(values));
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
        if(this.dni_cliente)
            return `[id ${this.#id}] - Cliente: ${this.clienteObj.nombre} [DNI ${this.dni_cliente}]`;
        else
            return `id: ${this.#id}`;
    }
}