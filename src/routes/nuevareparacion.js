// usersRoutes.js
const express = require('express');
const router = express.Router();
const path = require('path');
const Db = require('../controllers/pg.js');

let pg = Db.getInstance();

// Define tus rutas para usuarios
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname
        , '../../public/views/ingreso_producto.html'))
})
.post('/', (req, res) => {
    pg.nuevaReparacion(req.body);
    res.json({nombre: req.body.nombre, monto: 10000});
})

module.exports = router;