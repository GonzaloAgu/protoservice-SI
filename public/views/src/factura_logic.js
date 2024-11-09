const craftForm = () => {
    return {
        monto: $('#monto-input').val(),
        tipo: $('#tipo-factura-input').val(),
        medio_pago_id: $('#medio-pago-input').val(),
    }
}

/**
 * 
 * @param {*} form 
 * @throws
 */
const saveFacturaInDB = async form => {
    fetch('/api/factura', {
        method: 'POST',
        headers: {
            'Content-Type': "application/json"
        },
        body: JSON.stringify(form)
    })
    .then(res => res.json())
    .then(res => {
        if(res.ok)
            return res.factura_id;
        else
            throw new Error('Error al guardar factura')
    })
}

const getToPDF = (facturaId) => {
    window.href = `/printfactura?id=${facturaId}`
}

export async function handleGenerarPdfBtn (event) {
    const form = craftForm();
    try {
        const facturaId = await saveFacturaInDB(form)
        getToPDF(facturaId)
    } catch (err) {
        console.error('Error al guardar la factura o generando su PDF: ', err)
    }
}