const express = require('express');
const cors = require('cors');
const app = express();
const path = require('path');
require('dotenv').config();
const ejs = require('ejs');
const Db = require('./src/controllers/pg.js');
const Reparacion = require('./src/models/reparacion.js')

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

app.route('/reparacion')
    .get(async (req, res) => {
        let rep = new Reparacion(req.query.id);
        if(await rep.obtener()){
            const cliente = await rep.getClienteObj();
            res.render(path.join(__dirname, './public/views/reparacion.ejs'), { reparacion: rep, cliente });
        } else {
            res.status(404).send("<h1>Error 404: Reparación no encontrada.</h1>\n" + '\n<a href="/">Volver a la página principal.</a>');
        }
    })
    .delete(async (req, res) => {
        let reparacion = new Reparacion(req.body.id);
        const result = await reparacion.eliminar();
        const response = {
            ok: result,
        }
        res.json(response);
    });

app.post('/actualizarestado', async (req, res) => {
    pg.actualizarEstado(req.body.id, req.body.estado)
        .then(response => {
            const resp = {
                ok: true,
                response
            }
            res.json(resp);
        })
})

app.use('/tipo-productos', require(path.join(__dirname, './src/routes/tipos_electro.js')))
app.use('/nuevareparacion', require(path.join(__dirname, './src/routes/nuevareparacion.js')))
app.use('/buscar', require(path.join(__dirname, './src/routes/buscar.js')))


app.listen(PORT);
console.log("Servidor abierto en puerto ", PORT);