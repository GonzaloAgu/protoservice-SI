require('dotenv').config();
const Cliente = require('../src/models/cliente.js');
const { logTS } = require('../src/utils/log.js');

const cl = new Cliente(545334);

async function testGuardar(){
    cl.setNombre("Ramon Abila");
    cl.setTelefono(8934832);
    
    await cl.guardar();
}

async function testEliminar(){
    await cl.eliminar();
}

testGuardar()
.then( () => {
    testEliminar();
})
.catch(e => {
    console.error(e);
    process.exit(-1);
})
//.finally(() => process.exit(0))


