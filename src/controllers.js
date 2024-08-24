"use strict";

const { Cliente, Factura, Reparacion, TipoElectrodomestico, Fabricante  } = require('./models/models');

const getCliente = async(req, res) => {
    let cliente = new Cliente(req.query.id);
    let existe = await cliente.obtener();
    const response = {
        existe,
        cliente
    };
    res.json(response);
}

const postCliente = async(req, res) => {
    try {
        let cliente = new Cliente(req.body.cliente.id);
        cliente.nombre = req.body.cliente.nombre;
        cliente.telefono = req.body.cliente.telefono;
        const result = await cliente.guardar();
        res.status(200).json({ agregado: result == 1 });
    } catch(e){
        res.json({agregado: false, error: e})
    }
}

const postFactura = async (req, res) => {
    const form = req.body;
    let factura = new Factura();
    factura.tipo = form.tipo_factura;
    factura.fecha = new Date();
    factura.monto = form.monto;
    factura.medio_pago_id = form.medio_pago;
    await factura.guardar();

    const response = {ok: true, factura_id: factura._id};
    res.json(response)
}


const postReparacion = async (req, res) => {
    const rep = req.body;
    const electro = req.body.electrodomestico;
    const obj = new Reparacion();
    obj.desc_falla = rep.desc_falla;

    // electrodomestico
    let resultElectro = await Electrodomestico.obtenerTodos(`modelo='${rep.electrodomestico.modelo}' AND fabricante_id=${rep.electrodomestico.fabricante_id}`);
    
    let objElectro;
    if(resultElectro.length === 0){
        objElectro = new Electrodomestico();
        objElectro.modelo = electro.modelo;
        objElectro.fabricante_id = electro.fabricante_id;
        objElectro.tipo_electro_id = electro.tipo_electro_id;
        await objElectro.guardar();
    } else {
        const e = resultElectro[0];
        objElectro = new Electrodomestico(e.id);
        await objElectro.obtener();
    }

    obj.electrodomestico_id = objElectro.id;
    obj.desc_falla = rep.desc_falla;
    obj.fecha_recepcion = rep.fecha_recepcion;
    obj.id_cliente = rep.id_cliente;
    obj.factura_id = rep.factura_id;
    obj.estado = 'pendiente';

    if((await obj.guardar()) === 1){
        res.json({id: obj.id})
    } else {
        res.json({ error: 'No se insertó correctamente la reparación', id: obj.id })
}
}

const putReparacion = async (req, res) => {
    const { id, ...updates } = req.body;
    const reparacion = new Reparacion(id);
    await reparacion.obtener();

    for (const [key, value] of Object.entries(updates)) {
        if (value !== undefined) {
            reparacion[key] = value;
        }
    }

    let result = await reparacion.guardar();
    if (result === 0) {
        res.json({ ok: true, reparacion });
    } else if (result === 1) {
        await reparacion.eliminar();
        res.json({
            ok: false,
            error: "Se insertó una modificación cuando debía modificarse una existente."
        });
    } else {
        res.json({
            ok: false,
            error: "Se produjo un error"
        });
    }
}

const deleteReparacion = async (req, res) => {
    let reparacion = new Reparacion(req.body.id);
    let result;
    if(await reparacion.obtener()){
        result = await reparacion.eliminar();
        res.json({
            ok: result,
        })
    } else {
        logTS(`No se pudo eliminar la reparación con id ${req.body.id} porque no existe.`)
        res.json({ok: false});
    }
}

const getAllReparacion = async(req, res) => {
    let response;
    if(req.query.search){
        response = await Reparacion.buscarPorPalabra(req.query.search);
        res.json(response.rows);
    } else {
        res.json([])
    }
}

const getAllTiposElectrodomestico = async(req, res) => {
    let tipos = await TipoElectrodomestico.obtenerTodos("id<>0");
    let array = [];
    tipos.forEach(t => {
        array.push({
            id: t.id,
            descripcion: t.descripcion
        })
    })
    res.json(array);
}

const getAllFabricantes = async(req, res) => {
    let fabricantes = await Fabricante.obtenerTodos("id<>0");
    let array = [];
    fabricantes.forEach(t => {
        array.push({
            id: t.id,
            descripcion: t.descripcion
        })
    })
    res.json(array);
}

module.exports = {
    deleteReparacion,
    getAllFabricantes,
    getAllReparacion,
    getAllTiposElectrodomestico,
    getCliente,
    postCliente,
    postFactura,
    postReparacion,
    putReparacion
}