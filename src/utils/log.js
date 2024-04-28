function logTS(texto) {
    console.log(`[${new Date().toISOString()}] ` + texto);
}

module.exports = {
    logTS
}