require('dotenv').config();
const chai = require('chai');
const assert = chai.assert;
require('mocha');
require('../src/utils/log.js');



const Cliente = require('../src/models/cliente.js');
const { loggerOn } = require('../src/utils/log.js');

loggerOn(false);

const cl = new Cliente(Math.floor(10000 * Math.random()));
describe('ABM Cliente', () => {
    cl.setNombre("test_nombre");
    cl.setTelefono(8934832);

    it("Inserción", async() => {
        const res = await cl.guardar();
        assert.equal(res, 1);
    });

    it("Modificacion", async () => {
        cl.setNombre("Matias");
        cl.setTelefono("Bertolotti");
        const res = await cl.guardar();
        assert.equal(res, 0);
    })

    it("Eliminar", async () => {
        const res = await cl.eliminar();
        assert.equal(res, 1);
    })

})
    
