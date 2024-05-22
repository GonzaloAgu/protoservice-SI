const express = require('express');
const router = express.Router();
const Db = require('../controllers/pg.js');
const { TipoElectrodomestico, Fabricante } = require('../models/models');

const db = Db.getInstance();


router.get('/', async(req, res) => {
    let tipos = await TipoElectrodomestico.obtenerTodos();
    res.json(tipos);
})
.get('/fabricante', async(req, res) => {
    let fabricantes = await Fabricante.obtenerTodos();
    res.json(fabricantes);
})

module.exports = router;