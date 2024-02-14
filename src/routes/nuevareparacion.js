const express = require('express');
const router = express.Router();
const path = require('path');
const Db = require('../controllers/pg.js');

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
.post('/', validarReqBody, (req, res) => {
    pg.nuevaReparacion(req.body);
    res.json({nombre: req.body.nombre, monto: 10000});
})

module.exports = router;