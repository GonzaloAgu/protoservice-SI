require('dotenv').config();
const chai = require('chai');
const assert = chai.assert;
require('../src/utils/log.js');



const Cliente = require('../src/models/cliente.js');
const { loggerOn } = require('../src/utils/log.js');

loggerOn(false);

const cl = new Cliente(Math.floor(10000 * Math.random()));
describe('Cliente', () => {
    cl.nombre = "test_nombre";
    cl.telefono = 8934832;

    it("Inserción", async() => {
        const res = await cl.guardar();
        
        assert.equal(res, 1, "No se agregó.");
    });
    
    it("Obtencion", async() => {
        cl2 = new Cliente(cl.dni);
        await cl2.obtener();
        assert.equal(cl.nombre, cl2.nombre);
        assert.equal(cl.telefono, cl2.telefono);
    })

    it("Modificacion", async () => {
        cl.nombre = "Matias";
        cl.telefono = "Bertolotti";
        const res = await cl.guardar();
        assert.equal(res, 0);
    })

    it("Eliminar", async () => {
        const res = await cl.eliminar();
        assert.equal(res, 1);
    })

})
    
