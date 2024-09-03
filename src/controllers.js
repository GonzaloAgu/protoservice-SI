"use strict";

const { Cliente, Factura, Reparacion, TipoElectrodomestico, Fabricante  } = require('./models/models');

const getCliente = async(req, res) => {
    if(!req.query.id){
        const clientes = await Cliente.obtenerTodos();
        let array = [];
        clientes.forEach(cliente => {
            array.push({
                id: cliente.id,
                nombre: cliente.nombre,
                telefono: cliente.telefono
            })
        })
        res.json(array);
        return;
    }

    let cliente = new Cliente(req.query.id);
    let existe = await cliente.obtener();
    const response = {
        existe,
        cliente: {
            id: cliente.id,
            nombre: cliente.nombre,
            telefono: cliente.telefono
        }
    };
    res.json(response);
}

const postCliente = async(req, res) => {
    try {
        let cliente = new Cliente();
        cliente.nombre = req.body.nombre;
        cliente.telefono = req.body.telefono;
        const result = await cliente.guardar();
        res.status(200).json({ agregado: result == 1 });
    } catch(e){
        res.json({agregado: false, error: e})
    }
}

const postFactura = async (req, res) => {
    const form = req.body;
    let factura = new Factura();
    factura.tipo = form.tipo;
    factura.fecha = new Date();
    factura.monto = form.monto;
    factura.medio_pago_id = form.medio_pago_id;
    await factura.guardar();

    const response = {ok: true, factura_id: factura._id};
    res.json(response)
}


const postReparacion = async (req, res) => {
    const form = req.body;
    const reparacion = new Reparacion();
    reparacion.modelo_electro = form.modelo_electro;
    reparacion.desc_falla = form.desc_falla;
    reparacion.fecha_recepcion = new Date();
    reparacion.id_cliente = form.id_cliente;
    reparacion.factura_id = form.factura_id;
    reparacion.fabricante_id = form.fabricante_id;
    reparacion.tipo_electro_id = form.tipo_electro_id;
    reparacion.estado = 'pendiente';

    const ok = await reparacion.guardar();

    let response = {
        ok: ok === 1
    }

    if(ok !== 1){
        response.error = ok.detail;
        res.status(300);
    } else {
        response.reparacion_id = reparacion.id;
    }
    res.json(response);
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
    } else {
        response = await Reparacion.obtenerTodos();
    }
    res.json(response);
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

const getFactura = async(req, res) => {
    if(!req.query.id){
        let facturas = await Factura.obtenerTodos();
        let array = [];
        facturas.forEach(f => {
            array.push({
                id: f.id,
                tipo: f.tipo,
                monto: f.monto,
                fecha: f.fecha,
                medio_pago_id: f.medio_pago_id
            })
        })
        res.json(array);
        return;
    }

    let factura = new Factura(req.query.id);
    let existe = await factura.obtener();
    const response = {
        existe,
        factura: {
            id: factura.id,
            tipo: factura.tipo,
            monto: factura.monto,
            fecha: factura.fecha,
            medio_pago_id: factura.medio_pago_id
        }
    };
    res.json(response);

}



module.exports = {
    deleteReparacion,
    getAllFabricantes,
    getFactura,
    getAllReparacion,
    getAllTiposElectrodomestico,
    getCliente,
    postCliente,
    postFactura,
    postReparacion,
    putReparacion
}