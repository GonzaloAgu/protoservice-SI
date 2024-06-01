const path = require('path');
const { Reparacion, Electrodomestico, MedioPago } = require('../models/models.js')

const getReparacion = async (req, res) => {
    let rep = new Reparacion(req.query.id);
    if(await rep.obtener()){
        const [cliente, electrodomestico] = await Promise.all([rep.getClienteObj(), rep.getElectrodomesticoObj()]);
        const fabricante = await electrodomestico.getFabricanteObj();
        const mediosPago = await MedioPago.obtenerTodos();
        const factura = await rep.getFacturaObj();
        if(!cliente || !electrodomestico || !fabricante)
            res.status(500).send("<h1>Error 500</h1>\n<p>" + cliente + electrodomestico + '</p>\n<a href="/">Volver a la página principal.</a>');
        res.render(path.join(__dirname, '../../public/views/reparacionView.ejs'), { reparacion: rep, cliente, electrodomestico, fabricante, mediosPago, factura });
    } else {
        res.status(404).send("<h1>Error 404: Reparación no encontrada.</h1>\n" + '\n<a href="/">Volver a la página principal.</a>');
    }
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
    obj.dni_cliente = rep.dni_cliente;
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


module.exports = { getReparacion, postReparacion, deleteReparacion, putReparacion };