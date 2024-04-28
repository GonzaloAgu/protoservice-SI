const { Pool } = require('pg');
const { logTS } = require('../utils/log');
const pool = new Pool();


module.exports = class Cliente {
    constructor(dni) {
        this._dni = dni;
        this._nombre = null;
        this._telefono = null;
    }
    
    getDni(){
        return this._dni;
    }

    getNombre() {
        return this._nombre;
    }

    getTelefono() {
        return this._telefono;
    }

    setNombre(nombre){
        this._nombre = nombre;
    }

    setTelefono(tel){
        this._telefono = tel;
    }

    obtener(){
        let result = pool.query("SELECT * FROM cliente WHERE dni=$1;", [this._dni]);
        if(result.rows.length){
            const cliente = result.rows[0];
            this._nombre = cliente.nombre;
            this._telefono = cliente.telefono;
            return true;
        }
        return false;
    }

    /**
     * Almacena datos del cliente en la base de datos. Si no existia, lo agrega.
     * @returns 1 si lo agrego en la base. 0 si lo modifico. -1 si el DNI no es valido y por lo tanto no realizo ninguna operación.
     */
    async guardar(){
        if(!this._dni) return -1;
        const values = [this._dni, this._nombre, this._telefono];
        const existe = (await pool.query("SELECT * FROM cliente WHERE dni=$1;", [this._dni])).rows.length == 1;
        let result;
        if(!existe){
            logTS(`Insertando cliente ${this.toString()}...`);
            result = await pool.query("INSERT INTO cliente(dni, nombre, telefono) VALUES($1, $2, $3)",
            values);
            console.log(result.command + " finalizado.");
            return 1;
        } else {
            logTS(`Actualizando cliente ${this.toString()}...`);
            result = await pool.query("UPDATE cliente SET nombre=$2, telefono=$3 WHERE dni=$1", values);
            logTS(result.command + " finalizado.");
            return 0;
        }
    }

    toString(){
        return `DNI: ${this._dni} - ${this._nombre} - Tel: ${this._telefono}`;
    }
}