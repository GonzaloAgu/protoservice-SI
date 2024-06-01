"use strict";

let isOn = true;

function loggerOn(on){
    isOn = on;
}

function logTS(texto) {
    if(isOn)
        console.log(`[${new Date().toISOString()}] ` + texto);
}

module.exports = {
    loggerOn,
    logTS
}