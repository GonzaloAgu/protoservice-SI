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

  getPool(){
    return this.pool;
  }

  validarParametrosQuery(columnas, valores){
    if(columnas.length !== valores.length) throw 'Distinto numero de columnas y valores enviados.';
    if(!columnas.length) throw 'Parametros inválidos (Arreglos vacíos o no son arreglos).';
    return true;
  }

  async insert(nombreTabla, columnas, valores){
    
    this.validarParametrosQuery(columnas, valores);
    const colNum = columnas.length;

    let query = `INSERT INTO ${nombreTabla}(`;
    let i;
    for(i=1; i <= colNum; i++){
      query += `$${i}, `;
    }

    query = query.slice(0, -2);
    query += ") VALUES(";
    for(; i <= 2*colNum; i++){
      query += `$${i}, `;
    }
    query = query.slice(0, -2);
    query += ");";
    return await this.pool.query(query, columnas.concat(valores));
  }

  async update(nombreTabla, columnas, valores){
    if(columnas.length !== valores.length) throw 'Distinto numero de columnas y valores enviados.';

    const colNum = columnas.length;

    let query = `UPDATE ${nombreTabla} SET `;
    let i;
    for(i=1; i <= colNum; i++){
      query += `$${i}, `;
    }

    query = query.slice(0, -2);
    query += ") VALUES(";
    for(; i <= 2*colNum; i++){
      query += `$${i}, `;
    }
    query = query.slice(0, -2);
    query += ");";
    return await this.pool.query(query, columnas.concat(valores)).rows;
  }

  async obtenerTiposElectro() {
    return (await this.pool.query('SELECT * FROM tipo_electro WHERE id<>0 ORDER BY descripcion;')).rows;
  }

  async obtenerFabricantes() {
    return (await this.pool.query('SELECT * FROM fabricante WHERE id<>0 ORDER BY descripcion;')).rows;
  }
  async obtenerReparacionPorId(id){
    try{
      const query = `SELECT Rx.id, Cx.dni, Cx.nombre, Fx.descripcion AS marca, Ex.modelo,
      Rx.fecha_recepcion,Rx.desc_falla, Rx.estado
      FROM reparacion Rx
      JOIN cliente Cx ON Rx.dni_cliente = Cx.dni
      JOIN electrodomestico Ex ON Rx.electrodomestico_id = Ex.id
      JOIN fabricante Fx ON Ex.fabricante_id = Fx.id
      WHERE Rx.id=$1;`;
      const result = (await this.pool.query(query, [id]));
      return result.rows;
    } catch(e){
      console.error("Error al buscar la reparación con id " + id);
      console.error(e);
      return {rows: [], rowCount: 0};
    }
  }

  async nuevaReparacion(reqbody) {
    let response = {}; 
    let idElectro;
    // Controlo tabla de electrodomesticos
    try{
      // Busco el electrodomestico en cuestion y obtengo id
      const res = await this.pool.query('SELECT id FROM electrodomestico WHERE fabricante_id=$1 AND modelo=$2', [reqbody.fabricante, reqbody.modelo]);
      idElectro = res.rows[0].id;
      if(!idElectro) throw 'Nuevo electrodoméstico a agregar.'
    } catch(e){
      // Si no existe, lo agrego y obtengo su id autogenerado
      const res = await this.pool.query('INSERT INTO electrodomestico(tipo_electro_id, fabricante_id, modelo) VALUES($1, $2, $3) RETURNING id', 
      [reqbody.tipo, reqbody.fabricante, reqbody.modelo])
      idElectro = res.rows[0].id;
    } finally {
      response.id_electro = idElectro;
    }


    // Agrego reparacion

    const queryInput = [idElectro, reqbody.falla, new Date(), 'pendiente', reqbody.dni]
    
    try{
      const insertResponse = await this.pool.query(
        `INSERT INTO reparacion(electrodomestico_id, desc_falla, fecha_recepcion, estado, dni_cliente)
        VALUES($1, $2, $3, $4, $5) RETURNING id`,
        queryInput);
      response.id = insertResponse.rows[0].id;
      
      console.log(`Reparacion con ID=${response.id} agregada.`)
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
/**
 * Devuelve un cliente mediante su DNI
 * @param {*} dni 
 * @returns {existe, cliente}
 */
  async buscarCliente(dni){
    let result = (await this.pool.query('SELECT nombre, telefono FROM cliente WHERE dni=$1', [dni]));
    return {
      existe: result.rowCount !== 0,
      cliente: result.rows[0] || false
    }
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

  async eliminarReparacionPorId(id){
    const query = `DELETE FROM reparacion WHERE id=$1`;
    const result = (await this.pool.query(query, [id]));
    return result;
  }

  async actualizarEstado(id, estado) {
    const query = `UPDATE reparacion SET estado=$2 WHERE id=$1`;
    try{
      const result = (await this.pool.query(query, [id, estado]));
      return result;
    }
    catch(e) {
      return e;
    }
  }

}



