const express = require('express');
const cors = require('cors');
const app = express();
const path = require('path');
require('dotenv').config();
const ejs = require('ejs');
const Db = require('./src/controllers/pg.js');

let pg = Db.getInstance();

const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname,"public")));
app.use(cors());
app.use(express.json());
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    //res.sendFile(path.join(__dirname, './public/views/index.html'))
    res.redirect('/nuevareparacion');
})

app.get('/consulta', (req, res) => {
    res.sendFile(path.join(__dirname, './public/views/consultas.html'))
})

app.get('/reparacion', async(req, res) => {
    const result = (await pg.obtenerReparacionPorId(req.query.id));
    if(result.rowCount === 0){
        res.status(404).send("Error: Reparación no encontrada.");
    } else {
        res.render(path.join(__dirname, './public/views/reparacion.ejs'), { reparacion: result[0] });
    }
})

app.use('/tipo-productos', require(path.join(__dirname,'./src/routes/tipos_electro.js')))
app.use('/nuevareparacion', require(path.join(__dirname,'./src/routes/nuevareparacion.js')))
app.use('/buscar', require(path.join(__dirname,'./src/routes/buscar.js')))



app.listen(PORT);
console.log("Servidor abierto en puerto ", PORT);