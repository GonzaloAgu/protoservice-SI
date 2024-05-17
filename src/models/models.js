const Electrodomestico = require('./electrodomestico.js')

class IModelo {
    /**
     * Obtiene todos los electrodomésticos de la base.
     * @returns array con los resultados
     */
    static async obtenerTodos() {
        throw "Metodo obtenerTodos no implementado."
    }

    /**
     * Obtiene todos los electrodomésticos de la base.
     * @returns array con los resultados
     */
    static async obtenerTodos(query) {
        throw "Metodo obtenerTodos(query) no implementado."
    }


    /**
     * Busca y obtiene al tipo de electrodoméstico en la base de datos.
     * @returns true si lo encontró, false si no existe.
     */
    async obtener() {
        throw "Metodo obtener no implementado."
    }

     /**
     * Almacena datos del tipo de electrodomestico en la base de datos. Si no existia, lo agrega.
     * @returns 1 si lo agrego en la base. 0 si lo modifico. -1 si se produjo un error.
     */
    async guardar() {
        throw "Metodo guardar no implementado."
    }
}

module.exports = {
    IModelo,
    Cliente: require('./cliente.js'),
    Fabricante: require('./fabricante.js'),
    TipoElectrodomestico: require('./tipo_electro.js'),
    Electrodomestico: require('./electrodomestico.js')
}