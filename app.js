const express = require('express');
const cors = require('cors');
const app = express();
const path = require('path');
require('dotenv').config();
const ejs = require('ejs');
const Db = require('./src/controllers/pg.js');
const Reparacion = require('./src/models/reparacion.js');
const { Electrodomestico } = require('./src/models/models.js');

let pg = Db.getInstance();

const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "public")));
app.use(cors());
app.use(express.json());
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.redirect('/nuevareparacion');
})

app.get('/consulta', (req, res) => {
    res.sendFile(path.join(__dirname, './public/views/consultas.html'))
})

app.route('/electrodomestico')
    .post(async (req, res) => {
        const elec = req.body;
        const obj = new Electrodomestico();
        obj.tipo_electro_id = elec.tipo_electro_id;
        obj.fabricante_id = elec.fabricante_id;
        obj.modelo = elec.modelo;
        // sin hacer
    })

app.route('/reparacion')
    .get(async (req, res) => {
        let rep = new Reparacion(req.query.id);
        if(await rep.obtener()){
            const [cliente, electrodomestico] = await Promise.all([rep.getClienteObj(), rep.getElectrodomesticoObj()]);
            const fabricante = await electrodomestico.getFabricanteObj();
            if(!cliente || !electrodomestico || !fabricante)
                res.status(500).send("<h1>Error 500</h1>\n<p>" + cliente + electrodomestico + '</p>\n<a href="/">Volver a la página principal.</a>');
            res.render(path.join(__dirname, './public/views/reparacion.ejs'), { reparacion: rep, cliente, electrodomestico, fabricante });
        } else {
            res.status(404).send("<h1>Error 404: Reparación no encontrada.</h1>\n" + '\n<a href="/">Volver a la página principal.</a>');
        }
    })
    .post(async (req, res) => {
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
    })
    .delete(async (req, res) => {
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
    });

app.post('/actualizarestado', async (req, res) => {
    const reparacion = new Reparacion(req.body.id);
    await reparacion.obtener();
    reparacion.estado = req.body.estado;
    let result = await reparacion.guardar();
    if( result == 0 ){
        const resp = {
            ok: true
        }
        res.json(resp);
    } else if(result == 1) {
        await reparacion.eliminar();
        res.json({
            ok: false,
            error: "Se insertó una modificación cuando debía modificarse una existente."
        })
    } else {
        res.json({
            ok: false,
            error: "Se produjo un error"
        })
    }
})

app.use('/tipo-productos', require(path.join(__dirname, './src/routes/tipos_electro.js')))
app.use('/nuevareparacion', require(path.join(__dirname, './src/routes/nuevareparacion.js')))
app.use('/buscar', require(path.join(__dirname, './src/routes/buscar.js')))


app.listen(PORT);
console.log("Servidor abierto en puerto ", PORT);