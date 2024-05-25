const express = require('express');
const cors = require('cors');
const path = require('path');

module.exports = class Server {
    constructor() {
        this.app = express();
        middlewares();
        routes();
    }

    middlewares() {
        app.use(express.static(path.join(__dirname, "public")));
        app.use(cors());
        app.use(express.json());
        app.set('view engine', 'ejs');
    }

    routes() {
        
    }
}