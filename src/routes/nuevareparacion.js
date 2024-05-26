const express = require('express');
const router = express.Router();
const path = require('path');
const { Cliente } = require('../models/models');


router
.post('/obtenercliente', async(req, res) => {
    let cliente = new Cliente(req.body.dni);
    let existe = await cliente.obtener();
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
    } catch(e){
        res.json({agregado: false, error: e})
    }
})

module.exports = router;