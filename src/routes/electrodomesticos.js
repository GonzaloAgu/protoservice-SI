"use strict";

const router = require('express').Router();
const { TipoElectrodomestico, Fabricante } = require('../models/models');


router.get('/tipos', async(req, res) => {
    let tipos = await TipoElectrodomestico.obtenerTodos("id<>0");
    let array = [];
    tipos.forEach(t => {
        array.push({
            id: t.id,
            descripcion: t.descripcion
        })
    })
    res.json(array);
})
.get('/fabricantes', async(req, res) => {
    let fabricantes = await Fabricante.obtenerTodos("id<>0");
    let array = [];
    fabricantes.forEach(t => {
        array.push({
            id: t.id,
            descripcion: t.descripcion
        })
    })
    res.json(array);
})

module.exports = router;