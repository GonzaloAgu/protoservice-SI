const { Factura, MedioPago } = require('../models/models')

module.exports.postFactura = async (req, res) => {
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

module.exports.getAllMediosPago = async (req, res) => {
    const mediosPago = await MedioPago.obtenerTodos();
    res.json(mediosPago);
}