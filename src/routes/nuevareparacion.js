const express = require('express');
const router = express.Router();
const path = require('path');
const Db = require('../controllers/pg.js');
const { Cliente } = require('../models/models');

let pg = Db.getInstance();

// Middleware para validar los datos de req.body
function validarReqBody(req, res, next) {
    const datosObligatorios = [ req.body.dni, req.body.falla, 
        req.body.tipo, req.body.fabricante, req.body.modelo ];

    datosObligatorios.forEach(d => {
        if(!d)
            return res.status(400).json({ error: 'Faltan campos obligatorios en req.body' , datosRecibidos: datosObligatorios}); 
    });
    next();
  }

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname
        , '../../public/views/ingreso_producto.html'))
})
.post('/', validarReqBody, async (req, res) => {
    res.json(await pg.nuevaReparacion(req.body));
}).post('/obtenercliente', async(req, res) => {
    let cliente = new Cliente(req.body.dni);
    let existe = await cliente.obtener();
    console.log(cliente);
    const response = {
        existe,
        cliente
    };
    res.json(response);
}).post('/agregarcliente', async(req, res) => {
    try {
        let cliente = new Cliente(req.body.cliente.dni);
        cliente.nombre = req.body.cliente.nombre;
        cliente.telefono = req.body.cliente.telefono;
        const result = await cliente.guardar();
        res.status(200).json({ agregado: result == 1 });
        //pg.agregarCliente(req.body.cliente.dni, req.body.cliente.nombre, req.body.cliente.telefono);
    } catch(e){
        res.json({agregado: false, error: e})
    }
})

module.exports = router;