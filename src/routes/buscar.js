const express = require('express');
const router = express.Router();
const Db = require('../controllers/pg.js');

let pg = Db.getInstance();

router.get('/', async(req, res) => {
    const response = await pg.buscarReparaciones(req.query.search);
    res.json(response);
})

module.exports = router;