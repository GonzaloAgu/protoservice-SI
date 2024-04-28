require('dotenv').config();
const Cliente = require('../src/models/cliente.js');

const cl = new Cliente(545334);

cl.setNombre("Ramon Abila");
cl.setTelefono(8934832);

cl.guardar();
