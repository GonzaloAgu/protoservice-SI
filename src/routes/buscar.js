const express = require('express');
const router = express.Router();
const Reparacion = require('../models/reparacion')

router.get('/', async(req, res) => {
    let response;
    if(req.query.search){
        response = await Reparacion.buscarPorPalabra(req.query.search);
        res.json(response.rows);
    } else {
        res.json([])
    }
})

module.exports = router;