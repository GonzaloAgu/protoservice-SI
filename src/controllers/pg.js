const { Pool } = require('pg');

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

/**
 * Busca reparaciones en base a término de búsqueda ingresado
 * @param {*} termino 
 * @returns resultado de query
 */
  async buscarReparaciones(termino){

    function isNumeric(str) {
      if (typeof str != "string") return false // we only process strings!  
      return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
             !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
    }
    let query = `SELECT Rx.id, Cx.dni, Cx.nombre, Fx.descripcion AS marca, Ex.modelo,
    Rx.fecha_recepcion,Rx.desc_falla, Rx.estado
    FROM reparacion Rx
    JOIN cliente Cx ON Rx.dni_cliente = Cx.dni
    JOIN electrodomestico Ex ON Rx.electrodomestico_id = Ex.id
    JOIN fabricante Fx ON Ex.fabricante_id = Fx.id
    WHERE Cx.nombre ILIKE $1 OR Ex.modelo ILIKE $1
    OR Fx.descripcion ILIKE $1 OR Rx.desc_falla ILIKE $1`;

    if(isNumeric(termino)){
      query += ` OR Cx.dni::TEXT LIKE $1`
    }
    query += ' ORDER BY Rx.fecha_recepcion, Cx.nombre;'

    let result = (await this.pool.query(query, ['%' + termino + '%']))
    return result;
  }
}



