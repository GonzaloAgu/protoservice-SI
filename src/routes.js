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
    res.sendFile(path.join(__dirname, '../public/views/consultas.html'));
});

router.get('/nuevareparacion', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/views/ingreso_producto.html'));
});

router.get('/reparacion', async (req, res) => {
    try {
        let rep = new Reparacion(req.query.id);
        if (await rep.obtener()) {
            const [cliente, electrodomestico] = await Promise.all([
                rep.getClienteObj(),
                rep.getElectrodomesticoObj()
            ]);
            const fabricante = await electrodomestico.getFabricanteObj();
            const mediosPago = await MedioPago.obtenerTodos();
            const factura = await rep.getFacturaObj();

            if (!cliente || !electrodomestico || !fabricante) {
                return res.status(500).send(`
                    <h1>Error 500</h1>
                    <p>Hubo un error al obtener la información del cliente, electrodoméstico o fabricante.</p>
                    <a href="/">Volver a la página principal.</a>
                `);
            }

            return res.render(path.join(__dirname, '../../public/views/reparacionView.ejs'), {
                reparacion: rep,
                cliente,
                electrodomestico,
                fabricante,
                mediosPago,
                factura
            });
        } else {
            return res.status(404).send(`
                <h1>Error 404: Reparación no encontrada.</h1>
                <a href="/">Volver a la página principal.</a>
            `);
        }
    } catch (error) {
        return res.status(500).send(`
            <h1>Error 500: Error interno del servidor.</h1>
            <p>${error.message}</p>
            <a href="/">Volver a la página principal.</a>
        `);
    }
});

module.exports = router;