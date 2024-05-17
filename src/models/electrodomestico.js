const { logTS } = require('../utils/log');
const { TipoElectrodomestico, Fabricante } = require("./models");
const pool = require("../controllers/pg").getInstance();

const IModelo = require("./Imodelo.js");

module.exports = class Electrodomestico extends IModelo {
    constructor(id){
        super();
        this._id = id;
        this._tipo_electro_id = undefined;
        this._fabricante_id = undefined;
        this._modelo = undefined;
    }

    get id() {
        return this._id;
    }

    get modelo() {
        return this._modelo;
    }

    set modelo(m) {
        this._modelo = m;
    }

    get tipo_electro_id() {
        return this._tipo_electro_id;
    }

    set tipo_electro_id(id) {
        this._tipo_electro_id = id;
    }

    get fabricante_id() {
        return this._fabricante_id;
    }

    set fabricante_id(id) {
        this._fabricante_id = id;
    }


    get tipoElectroObj(){
        const tipoElectro = new TipoElectrodomestico(this._tipo_electro_id);
        if(tipoElectro.obtener())
            return tipoElectro;
        logTS("No se encontró tipo de electrodoméstico con id ", this._tipo_electro_id);
        return null;
    }

    get fabricanteObj(){
        const fabricante = new Fabricante(this._fabricante_id);
        if(fabricante.obtener())
            return fabricante;
        logTS("No se encontró fabricante con id ", this._tipo_electro_id);
        return null;
    }

    /**
     * Obtiene todos los electrodomésticos de la base.
     * @returns array con los resultados
     */
    static async obtenerTodos() {
        return await pool.query("SELECT * FROM electrodomestico").rows;
    }

    /**
     * Obtiene todos los electrodomésticos de la base.
     * @returns array con los resultados
     */
    static async obtenerTodos(query) {
        return await pool.query("SELECT * FROM electrodomestico WHERE", query).rows;
    }


    /**
     * Busca y obtiene al tipo de electrodoméstico en la base de datos.
     * @returns true si lo encontró, false si no existe.
     */
    async obtener() {
        const result = await pool.query("SELECT * FROM fabricante WHERE id=$1", [this.id]);
        if(result.rows.length) {
            this.tipo_electro_id = result.rows[0].tipo_electro_id;
            this.fabricante_id = result.rows[0].fabricante_id;
            this.modelo = result.rows[0].modelo;
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
            const values = [this.id, this.tipo_electro_id, this.fabricante_id, this.modelo];
            const existe = (await pool.query("SELECT * FROM fabricante WHERE id=$1;", [this._id])).rows.length == 1;
    
            if (!existe) {
                logTS(`Insertando fabricante ${this.toString()}...`);
                const result = await pool.query("INSERT INTO fabricante(tipo_electro_id, fabricante_id, modelo) VALUES($2, $3, $4)", values);
                logTS(result.command + " finalizado.");
                return 1;
            } else {
                logTS(`Actualizando fabricante ${this.toString()}...`);
                const result = await pool.query("UPDATE fabricante SET tipo_electro_id=$2, fabricante_id=$3, modelo=$4 WHERE id=$1", values);
                logTS(result.command + " finalizado.");
                return 0;
            }
        } catch (error) {
            console.error("Error al guardar fabricante:", error);
            return -1;
        }
    }

    toString() {
        return `${this.tipoElectroObj.toString} - ${this.fabricanteObj.toString} ${this.modelo}`;
    }
    
}