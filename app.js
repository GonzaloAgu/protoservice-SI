const express = require('express');
const cors = require('cors');
const app = express();
const path = require('path');
require('dotenv').config();
const { getReparacion, postReparacion, deleteReparacion, putReparacion } = require('./src/controllers/reparacion.js');

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
    .get(getReparacion)
    .post(postReparacion)
    .put(putReparacion)
    .delete(deleteReparacion);


app.use('/tipo-productos', require(path.join(__dirname, './src/routes/tipos_electro.js')))
app.use('/nuevareparacion', require(path.join(__dirname, './src/routes/nuevareparacion.js')))
app.use('/buscar', require(path.join(__dirname, './src/routes/buscar.js')))


app.listen(PORT);
console.log("Servidor abierto en puerto ", PORT);