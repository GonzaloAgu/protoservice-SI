const express = require('express');
const router = express.Router();
const Db = require('../controllers/pg.js')

const db = Db.getInstance();


router.get('/', async(req, res) => {
    res.json((await db.obtenerTiposElectro()))
})
.get('/fabricante', async(req, res) => {
    res.json(await db.obtenerFabricantes())
})

module.exports = router;