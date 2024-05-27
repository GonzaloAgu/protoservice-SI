const { Pool } = require('pg');
require('dotenv').config();

module.exports = class Db {
  constructor() {
    if (!Db.instance) {
      this.pool = new Pool()
      this.pool.connect();
      Db.instance = this;
    } else {
      throw 'Instancia ya creada. Usar getInstance()';
    }
  }
/**
 * 
 * @returns {Db} Instancia singleton para acceder a base de datos.
 */
  static getInstance() {
    if(!Db.instance)
      new Db();
    return Db.instance;
  }
/**
 * Realiza una consulta SQL a la base de datos.
 * @param {string} sql consulta SQL a realizar con parámetros en forma de $1, $2, etc.
 * @param {Array} valores parámetros incluidos en la consulta.
 * @returns {Object} resultado completo de la consulta
 */
  async query(sql, valores){
    return this.pool.query(sql, valores);
  }
}



