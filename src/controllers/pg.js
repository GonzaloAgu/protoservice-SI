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
    try{
      await this.agregarCliente(reqbody.dni, reqbody.nombre, reqbody.telefono);
      console.log('Nuevo cliente agregado.')
    } catch(e) {
      console.log(e);
    } 
    //this.agregarElectrodomestico(reqbody.tipo, reqbody.fabricante, reqbody.modelo)
  }

  async agregarCliente(dni, nombre, telefono) {
    let result = (await this.pool.query(`SELECT nombre FROM cliente WHERE dni=${dni}`));
    if (result.rowCount === 0) {
      try {
        (await this.pool.query('INSERT INTO cliente(dni, nombre, telefono) VALUES($1, $2, $3)',
        [dni, nombre, telefono]));
      } catch(e){
        console.log('Hubo un problema al añadir un cliente.');
      }
    } else {
      throw `El cliente con DNI ${dni} ya existe.`
    }
  }

}



