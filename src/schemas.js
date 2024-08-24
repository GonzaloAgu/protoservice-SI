const Joi = require('joi');

const clienteCreateSchema = Joi.object({
    nombre: Joi.string().max(50).min(1).required(),
    telefono: Joi.string().max(12).min(5).required()
})

const clienteCreate = (req, res, next) => {
    const { error } = clienteCreateSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
} 

module.exports = {
    clienteCreate
}