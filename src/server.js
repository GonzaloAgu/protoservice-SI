const express = require('express');
const cors = require('cors');
const path = require('path');
const { getReparacion, postReparacion, deleteReparacion, putReparacion } = require('./controllers/reparaciones.js');

module.exports = class Server {
    constructor() {
        this.app = express();
        this.middlewares();
        this.routes();
    }

    middlewares() {
        this.app.use(express.static(path.join(__dirname, "../public")));
        this.app.use(cors());
        this.app.use(express.json());
        this.app.set('view engine', 'ejs');
    }

    routes() {
        // RUTAS A VIEWS
        this.app.get('/', (req, res) => {
            res.redirect('/consulta')
        });
        this.app.get('/consulta', (req, res) => {
            res.sendFile(path.join(__dirname, '../public/views/consultas.html'))
        });
        this.app.get('/nuevareparacion', (req, res) => {
            res.sendFile(path.join(__dirname, '../public/views/ingreso_producto.html'))
        })
        this.app.get('/reparacion', getReparacion);
        

        // RUTAS A APIs
        this.app.route('/reparacion')
            .post(postReparacion)
            .put(putReparacion)
            .delete(deleteReparacion);

        this.app.use('/cliente', require(path.join(__dirname, './controllers/clientes.js')));
        this.app.use('/electrodomesticos', require(path.join(__dirname, './routes/electrodomesticos.js')));
        this.app.use('/buscar', require(path.join(__dirname, './routes/buscar.js')));
        
    }

    listen(port) {
        this.app.listen(port);
        console.log("Servidor abierto en puerto ", port);
    }
}