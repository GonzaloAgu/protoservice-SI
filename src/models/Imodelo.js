module.exports = class IModelo {
    constructor(){
        this._id = null;
    }

    /**
     * Obtiene todos los electrodomésticos de la base.
     * @returns array con los resultados
     */
    static async obtenerTodos() {
        throw "Metodo obtenerTodos no implementado."
    }

    /**
     * Obtiene todos los electrodomésticos de la base.
     * @param {string} query busqueda SQL.
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
    /**
     * Elimina objeto de la base de datos
     * @returns true si se elimina correctamente, false en caso contrario.
     */
    async eliminar() {
        throw "Metodo eliminar no implementado.";
    }

    toString(){
        throw "Metodo toString no implementado.";
    }
}