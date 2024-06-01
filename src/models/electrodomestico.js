"use strict";

const { logTS } = require('../utils/log');
const TipoElectrodomestico = require('./tipo_electro.js');
const Fabricante = require('./fabricante.js');
const pool = require("../utils/pg.js").getInstance();

const IModelo = require("./Imodelo.js");

module.exports = class Electrodomestico extends IModelo {

    #id;
    tipoElectroObj;
    fabricanteObj;

    constructor(id){
        super();
        this.#id = id;
        this.tipo_electro_id = undefined;
        this.fabricante_id = undefined;
        this.modelo = undefined;
    }

    get id() {
        return this.#id;
    }

    async getTipoElectroObj(){
        const tipoElectro = new TipoElectrodomestico(this.tipo_electro_id);
        if(await tipoElectro.obtener()){
            this.tipoElectroObj = tipoElectro;
            return tipoElectro;
        }
        logTS("No se encontró tipo de electrodoméstico con id ", this.tipo_electro_id);
        return null;
    }

    async getFabricanteObj(){
        const fabricante = new Fabricante(this.fabricante_id);
        if(await fabricante.obtener()){
            this.fabricanteObj = fabricante;
            return fabricante;
        }
        logTS("No se encontró fabricante con id ", this.tipo_electro_id);
        return null;
    }

    /**
     * Obtiene todos los electrodomésticos de la base.
     * @returns array con los resultados
     */
    static async obtenerTodos(query) {
        let result;
        if(query)
            result = (await pool.query("SELECT * FROM electrodomestico WHERE " + query)).rows;
        else
            result = (await pool.query("SELECT * FROM electrodomestico")).rows;

        if(!result || result.length === 0)
            return [];

        const lista = [];
        result.forEach(item => {
            const obj = new Electrodomestico(item.id);
            obj.tipo_electro_id = item.tipo_electro_id;
            obj.fabricante_id = item.fabricante_id;
            obj.modelo = item.modelo;
            lista.push(obj);
        });
        return lista;
    }


    /**
     * Busca y obtiene al tipo de electrodoméstico en la base de datos.
     * @returns true si lo encontró, false si no existe.
     */
    async obtener() {
        const result = await pool.query("SELECT * FROM electrodomestico WHERE id=$1", [this.id]);
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
            const existe = (await pool.query("SELECT * FROM electrodomestico WHERE id=$1;", [this.#id])).rows.length == 1;
    
            if (!existe) {
                logTS(`Insertando electrodomestico...`);
                const result = await pool.query("INSERT INTO electrodomestico(tipo_electro_id, fabricante_id, modelo) VALUES($1, $2, $3) RETURNING id", [this.tipo_electro_id, this.fabricante_id, this.modelo]);
                this.#id = result.rows[0].id;
                logTS(result.command + `  ${this.toString()}` + " finalizado.");
                return 1;
            } else {
                logTS(`Actualizando electrodomestico ${this.toString()}...`);
                const result = await pool.query("UPDATE electrodomestico SET tipo_electro_id=$2, fabricante_id=$3, modelo=$4 WHERE id=$1", values);
                logTS(result.command + " finalizado.");
                return 0;
            }
        } catch (error) {
            console.error("Error al guardar electrodomestico:", error);
            return -1;
        }
    }

    toString() {
        return `id: ${this.id} - Modelo: ${this.modelo}`;
    }
    
}