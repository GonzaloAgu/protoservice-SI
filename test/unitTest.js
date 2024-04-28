require('dotenv').config();
const Cliente = require('../src/models/cliente.js');

const cl = new Cliente(545334);

async function testGuardar(){
    cl.setNombre("Ramon Abila");
    cl.setTelefono(8934832);
    
    return await cl.guardar();
}

testGuardar().catch(e => console.error(e));