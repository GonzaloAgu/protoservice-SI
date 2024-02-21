const express = require('express');
const router = express.Router();
const Db = require('../controllers/pg.js');

let pg = Db.getInstance();

router.get('/', async(req, res) => {
    let response;
    if(req.query.search){
        response = await pg.buscarReparaciones(req.query.search);
        res.json(response.rows);
    } else {
        res.json([])
    }
})

module.exports = router;