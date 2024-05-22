const express = require('express');
const router = express.Router();
const Db = require('../controllers/pg.js');
const { TipoElectrodomestico } = require('../models/models');

const db = Db.getInstance();


router.get('/', async(req, res) => {
    let tipos = await TipoElectrodomestico.obtenerTodos();
    res.json(tipos);
    //res.json((await db.obtenerTiposElectro()))
})
.get('/fabricante', async(req, res) => {
    res.json(await db.obtenerFabricantes())
})

module.exports = router;