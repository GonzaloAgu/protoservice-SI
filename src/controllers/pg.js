const { Pool } = require('pg');


module.exports = class Db {

  constructor() {
    if (!Db.instanciaCreada) {
      this.pool = new Pool()
      this.pool.connect();
      Db.instanciaCreada = this;
    } else {
      throw 'Instancia ya creada. Usar getInstance()';
    }
  }

  static getInstance() {
    if(!Db.instanciaCreada)
      new Db();
    return Db.instanciaCreada;
  }

  async query(msg, valores){
    return this.pool.query(msg, valores);
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



