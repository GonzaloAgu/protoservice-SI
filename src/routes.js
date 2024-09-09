"use strict";

const router = require('express').Router();
const ctrls = require('./controllers.js');
const path = require('path');
const schemas = require('./schemas.js');


const validateData = schema => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body);
        if (error)
            return res.status(400).json({ error: error.details });
        next();
    }
}


// Rutas de API

// Reparación
router.get('/api/buscar', ctrls.getAllReparacion);
router.get('/api/reparacion/:id', ctrls.getReparacion);
router.post('/api/reparacion', validateData(schemas.reparacionCreate), ctrls.postReparacion);
router.put('/api/reparacion', validateData(schemas.reparacionUpdate), ctrls.putReparacion);
router.delete('/api/reparacion', ctrls.deleteReparacion);

// Factura
router.get('/api/factura', ctrls.getFactura)
router.post('/api/factura', validateData(schemas.facturaCreate), ctrls.postFactura);

// Cliente
router.get('/api/cliente', ctrls.getCliente);
router.post('/api/cliente', validateData(schemas.clienteCreate), ctrls.postCliente);
router.patch('/api/cliente', validateData(schemas.clienteUpdate), ctrls.patchCliente)

// Tipo de electrodomestico y fabricantes
router.get('/api/tipos', ctrls.getAllTiposElectrodomestico);
router.get('/api/fabricantes', ctrls.getAllFabricantes);

// Rutas de vistas

router.get('/', (req, res) => {
    res.redirect('/consulta');
});

router.get('/consulta', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/views/buscar_reparaciones.html'));
});

router.get('/nuevareparacion', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/views/ingresar_reparacion.html'));
});

router.get('/reparacion', async (req, res) => {
    return res.sendFile(path.join(__dirname, '../public/views/reparacion.html'));
});

module.exports = router;