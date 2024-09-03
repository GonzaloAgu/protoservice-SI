const Joi = require('joi');

const deleteSch = Joi.object({
    id: Joi.number().min(0).required()
})

// SCHEMAS DE CLIENTE

const clienteBase = Joi.object({
    nombre: Joi.string().max(50).min(1).required(),
    telefono: Joi.string().max(12).min(5).required()
})

const clienteCreate = clienteBase.append({
    id: Joi.number().min(0).required()
});

const clienteUpdate = Joi.object({
    id: Joi.number().min(0).required(),
    nombre: Joi.string().max(50).min(1),
    telefono: Joi.string().max(12).min(5)
})

// SCHEMAS DE FABRICANTE

const fabricanteBase = Joi.object({
    descripcion: Joi.string().max(20).required()
})

const fabricanteCreate = fabricanteBase.append({
    id: Joi.number().min(0).required()
})

const fabricanteUpdate = fabricanteCreate;

// SCHEMAS DE FACTURA

const facturaCreate = Joi.object({
    tipo: Joi.string().regex(/^[a-cA-C]$/).required(),
    monto: Joi.number().min(0).required(),
    medio_pago_id: Joi.number().min(0).required()
})

const facturaUpdate = Joi.object({
    id: Joi.number().min(0).required(),
    tipo: Joi.string().pattern(/^[a-cA-C]$/),
    monto: Joi.number().min(0).required(),
    medio_pago_id: Joi.number().min(0)
})


module.exports = {
    deleteSch,
    clienteCreate,
    clienteUpdate,
    facturaCreate
}