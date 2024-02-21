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
    if (Db.instanciaCreada)
      return Db.instanciaCreada;
    else {
      new Db();
      return Db.instanciaCreada;
    }
  }

  async obtenerTiposElectro() {
    return (await this.pool.query('SELECT * FROM tipo_electro ORDER BY descripcion;')).rows;
  }

  async obtenerFabricantes() {
    return (await this.pool.query('SELECT * FROM fabricante ORDER BY descripcion;')).rows;
  }

  async nuevaReparacion(reqbody) {
    let response = {}; 
    let idElectro;
    // Controlo tabla de electrodomesticos
    try{
      // Busco el electrodomestico en cuestion y obtengo id
      idElectro = (await this.pool.query('SELECT id FROM electrodomestico WHERE id_fabricante=$1 AND modelo=$2', [reqbody.fabricante, reqbody.modelo])).rows[0].id;
      if(!idElectro) throw 'Nuevo electrodoméstico a agregar.'
    } catch(e){
      // Si no existe, lo agrego y obtengo su id autogenerado
      idElectro = (await this.pool.query('INSERT INTO electrodomestico(tipo_electro_id, fabricante_id, modelo) VALUES($1, $2, $3) RETURNING id', 
      [reqbody.tipo, reqbody.fabricante, reqbody.modelo])).rows[0].id;
    } finally {
      response.id = idElectro;
    }

    const queryInput = [idElectro, reqbody.falla, new Date(), 'pendiente', reqbody.dni]
    
    try{
      (await this.pool.query(
        `INSERT INTO reparacion(electrodomestico_id, desc_falla, fecha_recepcion, estado, dni_cliente)
        VALUES($1, $2, $3, $4, $5)`,
        queryInput));
      
      console.log(`Reparacion nº${idElectro} agregada.`)
      response.correcto = true;
      response.datos = queryInput;
    } catch(e){
      console.error(e);
      response.correcto = false;
    } finally {
      return response;
    }

  }

  async agregarCliente(dni, nombre, telefono) {
    let result = (await this.pool.query(`SELECT nombre FROM cliente WHERE dni=$1`, [dni]));
    if (result.rowCount === 0) {
      try {
        (await this.pool.query('INSERT INTO cliente(dni, nombre, telefono) VALUES($1, $2, $3)',
        [dni, nombre, telefono]));
        console.log(`Nuevo cliente en base de datos - DNI: ${dni} - Nombre: ${nombre}`)
      } catch(e){
        console.error('Hubo un problema al añadir un cliente. \n', e);
      }
    } else {
      throw `El cliente con DNI ${dni} ya existe.`
    }
  }

  async buscarCliente(dni){
    let result = (await this.pool.query('SELECT nombre, telefono FROM cliente WHERE dni=$1', [dni]));
    return {
      existe: result.rowCount !== 0,
      cliente: result.rows[0] || false
    }
  }

  async buscarReparaciones(termino){

    function isNumeric(str) {
      if (typeof str != "string") return false // we only process strings!  
      return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
             !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
    }
    let query = `SELECT Cx.dni, Cx.nombre, Fx.descripcion AS marca, Ex.modelo,
    Rx.fecha_recepcion,Rx.desc_falla, Rx.estado
    FROM reparacion Rx
    JOIN cliente Cx ON Rx.dni_cliente = Cx.dni
    JOIN electrodomestico Ex ON Rx.electrodomestico_id = Ex.id
    JOIN fabricante Fx ON Ex.fabricante_id = Fx.id
    WHERE Cx.nombre ILIKE $1 OR Ex.modelo ILIKE $1
    OR Fx.descripcion ILIKE $1 OR Rx.desc_falla ILIKE $1`;

    if(isNumeric(termino)){
      console.log('es numero')
      query += ` OR Cx.dni::TEXT LIKE $1`
    }
    query += ';'

    let result = (await this.pool.query(query, ['%' + termino + '%']))
    return result;
  }

}



