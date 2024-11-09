const craftForm = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const reparacion_id = urlParams.get('id');
    return {
        monto: $('#monto-input').val(),
        tipo: $('#tipo-factura-input').val(),
        medio_pago_id: $('#medio-pago-input').val(),
        reparacion_id
    }
}

/**
 * 
 * @param {*} form 
 * @throws
 */
const saveFacturaInDB = async form => {
    const response = await fetch('/api/factura', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(form)
    });

    const res = await response.json();

    if (res.ok) {
        return res.factura_id;
    } else {
        throw new Error('Error al guardar factura');
    }
};

const getToPDF = (facturaId) => {
    window.open(`/printfactura?id=${facturaId}`, '_blank').focus()
}

export async function handleGenerarPdfBtn (event) {
    $('#pdf-loading-spinner').removeClass('d-none')
    const form = craftForm();
    try {
        const facturaId = await saveFacturaInDB(form)
        $('#pdf-loading-spinner').addClass('d-none')
        getToPDF(facturaId)
    } catch (err) {
        console.error('Error al guardar la factura o generando su PDF: ', err)
    }
}