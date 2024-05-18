require('dotenv').config();
const chai = require('chai');
const assert = chai.assert;
require('../src/utils/log.js');
const db = require('../src/controllers/pg.js').getInstance();

const models = require('../src/models/models.js');

const { loggerOn } = require('../src/utils/log.js');

loggerOn(true);

const cl = new models.Cliente(Math.floor(10000 * Math.random()));
describe('Cliente', () => {
    cl.nombre = "test_nombre";
    cl.telefono = 8934832;

    it("Inserción", async() => {
        const res = await cl.guardar();
        assert.equal(res, 1, "No se agregó.");
    });
    
    it("Obtención", async() => {
        cl2 = new models.Cliente(cl.dni);
        await cl2.obtener();
        assert.isNotNull(cl.nombre);
        assert.equal(cl.nombre, cl2.nombre);
        assert.isNotNull(cl.telefono);
        assert.equal(cl.telefono, cl2.telefono);
    })

    it("Modificación", async () => {
        cl.nombre = "Matias";
        cl.telefono = "Bertolotti";
        const res = await cl.guardar();
        assert.equal(res, 0);
    })

    it("Eliminación", async () => {
        const res = await cl.eliminar();
        assert.equal(res, 1);
    })

});

fab = new models.Fabricante();
describe("Fabricante", () => {
    fab.descripcion = "test descripcion";
    it("Inserción", async() => {
        const res = await fab.guardar();
        assert.equal(res, 1, "No se agregó.");
    });
    
    it("Obtención", async() => {
        fab2 = new models.Fabricante(fab.id);
        await fab2.obtener();
        assert.isNotNull(fab.descripcion);
        assert.equal(fab.descripcion, fab2.descripcion);
    })

    it("Modificación", async () => {
        fab.descripcion = "test descripcion2";
        const res = await fab.guardar();
        assert.equal(res, 0);
    })

    it("Eliminación", async () => {
        const res = await fab.eliminar();
        db.query("ALTER SEQUENCE fabricante_id_seq RESTART WITH $1", [fab.id]); // restaurar secuencia de id's
        assert.equal(res, 1);
    })
})

te = new models.TipoElectrodomestico();
describe("Tipo electrodomestico", () => {
    te.descripcion = "test descripcion";
    it("Inserción", async() => {
        const res = await te.guardar();
        assert.equal(res, 1, "No se agregó.");
    });
    
    it("Obtención", async() => {
        te2 = new models.TipoElectrodomestico(te.id);
        const res = await te2.obtener();
        assert.isTrue(res, "No se encontró al objeto");
        assert.isNotNull(te.descripcion);
        assert.equal(te.descripcion, te2.descripcion);
    })

    it("Modificación", async () => {
        te.descripcion = "test descripcion2";
        const res = await te.guardar();
        assert.equal(res, 0);
    })

    it("Eliminación", async () => {
        const res = await te.eliminar();
        db.query("ALTER SEQUENCE tipo_electro_id_seq RESTART WITH $1", [te.id]); // restaurar secuencia de id's
        assert.equal(res, 1);
    })
})
    
