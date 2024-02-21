const express = require('express');
const cors = require('cors');
const app = express();
const path = require('path');
require('dotenv').config()

const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname,"public")));
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    //res.sendFile(path.join(__dirname, './public/views/index.html'))
    res.redirect('/nuevareparacion');
})

app.get('/consulta', (req, res) => {
    res.sendFile(path.join(__dirname, './public/views/consultas.html'))
})



app.use('/tipo-productos', require(path.join(__dirname,'./src/routes/tipos_electro.js')))
app.use('/nuevareparacion', require(path.join(__dirname,'./src/routes/nuevareparacion.js')))
app.use('/buscar', require(path.join(__dirname,'./src/routes/buscar.js')))



app.listen(PORT);
console.log("Servidor abierto en puerto ", PORT);