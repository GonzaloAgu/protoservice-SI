"use strict";

const path = require('path')
const ejs = require('ejs');

const PuppeteerHTMLPDF = require('puppeteer-html-pdf');
const htmlPDF = new PuppeteerHTMLPDF();
htmlPDF.setOptions({
    format: 'A4',
    printBackground: true,
    margin: {
        top: '1cm',
        right: '1cm',
        bottom: '1cm',
        left: '1cm'
      },
})

const { Cliente, Factura, Reparacion, TipoElectrodomestico, Fabricante, Comentario  } = require('./models/models');

const getCliente = async(req, res) => {
    if(!req.query.id){
        const clientes = await Cliente.obtenerTodos();
        res.json(clientes);
        return;
    }

    let cliente = new Cliente(req.query.id);
    let existe = await cliente.obtener();
    const response = {
        existe
    };

    if(existe)
        response.cliente = {
            id: cliente.id,
            nombre: cliente.nombre,
            telefono: cliente.telefono
        }
    res.json(response);
}

const postCliente = async(req, res) => {
    try {
        let cliente = new Cliente();
        cliente.nombre = req.body.nombre;
        cliente.telefono = req.body.telefono;
        await cliente.guardar();
        res.status(200).json(cliente);
    } catch(e){
        res.json({ error: e })
    }
}

const patchCliente = async(req, res) => {
    let cliente = new Cliente(req.body.id);
    if( !(await cliente.obtener()))
        res.status(400).json({ error: 'El cliente que se intentó modificar no existe. Id: ' + req.body.id })
    if(req.body.telefono)
        cliente.telefono = req.body.telefono;
    if(req.body.nombre)
        cliente.nombre = req.body.nombre;
    
    if((await cliente.guardar()) == 0)
        res.status(200).json(cliente)
    else
        res.status(500).json({ error: 'Se produjo un error al almacenar el cliente deseado' })
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

const getReparacion = async (req, res) => {
    const reparacion = new Reparacion(req.params.id);
    const existe = await reparacion.obtener();

    if(existe)
        res.json(reparacion)
    else
        res.json({ error: 'Reparacion no existe' })
}


const postReparacion = async (req, res) => {
    const form = req.body;
    const reparacion = new Reparacion();
    reparacion.modelo_electro = form.modelo_electro;
    reparacion.desc_falla = form.desc_falla;
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

const patchReparacion = async (req, res) => {
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
        // eliminar comentarios de la reparación
        reparacion.getComentarios()
        .then(comentarios => {
            comentarios.forEach( async(c) => c.eliminar())
        })

        // eliminar reparación
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
    let data;
    if(req.query.search){
        data = await Reparacion.buscarPorPalabra(req.query.search);
    } else {
        data = await Reparacion.obtenerTodos();
    }

    const response = await Promise.all(
        data.map(async (rep) => ({
            id: rep.id,
            cliente: await rep.getClienteObj(),
            fabricante: await rep.getFabricanteObj(),
            modelo_electro: rep.modelo_electro,
            factura: await rep.getFacturaObj(),
            estado: rep.estado,
            desc_falla: rep.desc_falla,
            fecha_recepcion: rep.fecha_recepcion,
            comentarios: await rep.getComentarios()
        }))
    );

    res.json(response);
}

const getComentarios = async(req, res) => {
    const reparacion = new Reparacion(req.params.id_reparacion);
    const comentarios = await reparacion.getComentarios();
    res.json(comentarios);
}

const postComentario = async(req, res) => {
    const comment = new Comentario();
    comment.texto = req.body.texto;
    comment.id_reparacion = req.body.id_reparacion;

    const ok = await comment.guardar();

    let response = {
        ok: ok === 1
    }

    if(ok !== 1){
        response.error = ok.detail;
        res.status(300);
    } else {
        response.reparacion_id = comment.id;
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

const postTipoElectrodomestico = async(req, res) => {
    const tipo = new TipoElectrodomestico();
    tipo.descripcion = req.body.descripcion;
    
    const ok = await tipo.guardar();

    let response = {
        ok: ok === 1,
        error: null,
        tipo_electro_id: null
    }

    if(ok !== 1){
        response.error = ok.detail;
        res.status(300).json(response);
    } else {
        response.tipo_electro_id = tipo.id;
    }
    res.json(response);
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

const postFabricante = async(req, res) => {
    const fabricante = new Fabricante();
    fabricante.descripcion = req.body.descripcion;

    const ok = await fabricante.guardar();

    let response = {
        ok: ok === 1,
        error: null,
        fabricante_id: null
    }

    if(ok !== 1) {
        response.error = ok.detail;
        res.status(300).json(response);
    } else {
        response.fabricante_id = fabricante.id;
    }

    res.json(response);
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

const getFacturaPdf = async(req, res) =>{
    try {
        const { id } = req.query;
        const response = await fetch('http://localhost:3000/api/factura?id=' + id);
        const factura = await response.json();
    
        const templatePath = path.join(__dirname, './pdf/factura.ejs');
        const html = await ejs.renderFile(templatePath, factura);
    
        
    
        const pdfBuffer = await htmlPDF.create(html);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'inline; filename=factura.pdf');
        res.send(pdfBuffer);
    } catch (error) {
        console.error('Error generando el PDF:', error);
        res.status(500).send('Error al generar la factura');
    }
}


module.exports = {
    deleteReparacion,
    getAllFabricantes,
    getFactura,
    getAllReparacion,
    getAllTiposElectrodomestico,
    getCliente,
    postCliente,
    patchCliente,
    postFabricante,
    postFactura,
    getReparacion,
    postReparacion,
    patchReparacion,
    getComentarios,
    postComentario,
    postTipoElectrodomestico,
    getFacturaPdf
}