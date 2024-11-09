const Joi = require('joi');

const deleteSch = Joi.object({
    id: Joi.number().min(0).required()
})

// SCHEMAS DE CLIENTE

const clienteCreate = Joi.object({
    nombre: Joi.string().max(50).min(1).required(),
    telefono: Joi.string().max(12).min(5).required()
});

const clienteUpdate = Joi.object({
    id: Joi.number().min(0).required(),
    nombre: Joi.string().max(50).min(1),
    telefono: Joi.string().max(12).min(5)
})

// SCHEMAS DE FABRICANTE

const fabricanteCreate = Joi.object({
    descripcion: Joi.string().max(20).required()
})

const fabricanteUpdate = fabricanteCreate;

// SCHEMAS DE TIPO DE ELECTRODOMESTICO

const tipoCreate = Joi.object({
    descripcion: Joi.string().max(30).required()
})

// SCHEMAS DE FACTURA

const facturaCreate = Joi.object({
    tipo: Joi.string().regex(/^[a-cA-C]$/).required(),
    monto: Joi.number().min(0).required(),
    medio_pago_id: Joi.number().min(0).required(),
    reparacion_id: Joi.number().min(0).required()
})

const facturaUpdate = Joi.object({
    id: Joi.number().min(0).required(),
    tipo: Joi.string().pattern(/^[a-cA-C]$/),
    monto: Joi.number().min(0).required(),
    medio_pago_id: Joi.number().min(0)
})

// SCHEMAS DE REPARACION

const estados = ['pendiente', 'en revision', 'reparado', 'sin arreglo'];

const reparacionCreate = Joi.object({
    desc_falla: Joi.string().max(500),
    id_cliente: Joi.number().min(0).required(),
    factura_id: Joi.number().min(0),
    modelo_electro: Joi.string().max(100).required(),
    tipo_electro_id: Joi.number().min(0),
    fabricante_id: Joi.number().min(0).required()
})


const reparacionUpdate = Joi.object({
    id: Joi.number().min(0).required(),
    desc_falla: Joi.string().max(500),
    id_cliente: Joi.number().min(0),
    estado: Joi.string().valid(...estados),
    factura_id: Joi.number().min(0),
    modelo_electro: Joi.string().max(100),
    tipo_electro_id: Joi.number().min(0),
    fabricante_id: Joi.number().min(0)
})

// SCHEMAS DE COMENTARIO

const comentarioCreate = Joi.object({
    texto: Joi.string().max(500),
    id_reparacion: Joi.number().min(0)
})

module.exports = {
    deleteSch,
    clienteCreate,
    clienteUpdate,
    fabricanteCreate,
    facturaCreate,
    facturaUpdate,
    reparacionCreate,
    reparacionUpdate,
    comentarioCreate,
    tipoCreate
}