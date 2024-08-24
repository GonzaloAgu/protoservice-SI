"use strict";
const express = require('express');
const cors = require('cors');
const path = require('path');
const router = require('./routes.js')

module.exports = class Server {
    constructor() {
        this.app = express();
        middlewares();
        this.app.use(router);
    }

    middlewares() {
        this.app.use(express.static(path.join(__dirname, "../public")));
        this.app.use(cors());
        this.app.use(express.json());
        this.app.set('view engine', 'ejs');
    }

    listen(port) {
        this.app.listen(port);
        console.log("Servidor abierto en puerto ", port);
    }
}