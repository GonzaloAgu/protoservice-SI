"use strict";

const express = require('express');
const router = express.Router();
const { Cliente } = require('../models/models');


router
.get('/', async(req, res) => {
    let cliente = new Cliente(req.query.dni);
    let existe = await cliente.obtener();
    const response = {
        existe,
        cliente
    };
    res.json(response);
}).post('/', async(req, res) => {
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