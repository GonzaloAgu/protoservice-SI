function mostrarPopup(mensaje, huboError = false) {
    const popup = document.getElementById("popup");
    popup.textContent = mensaje;
    if(huboError)
        popup.style.backgroundColor = '#CD5C5D';
    else
        popup.style.backgroundColor = '#4CAF50';
    popup.classList.add('show');
    setTimeout(() => {
        popup.classList.remove('show')
    }, 2000);
}

function actualizarEstado() {
    const parametros = new URLSearchParams(window.location.search);
    const id = parametros.get("id");

    fetch("/reparacion", {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: id, estado: document.getElementById("estado-select").value })
        })
        .then(response => {
            console.log(response);
            if (response.ok)
                mostrarPopup("Estado de reparación cambiado correctamente.", false);
            else
                mostrarPopup("ERROR: No se pudo actualizar el estado del producto.", true)
        })
        .catch(e => {
            alert("Error: ", e)
        })
}


function toggleFormularioRetiro(){
    const retiroForm = document.getElementById('retiroForm');

    if( retiroForm.style.display === 'none')
        retiroForm.style.display = 'block';
    else
        retiroForm.style.display = 'none'
}

function main() {
    const retirarClienteBtn = document.getElementById("retiro-btn")
    const eliminarBtn = document.getElementById('eliminar-btn');
    const retiroForm = document.getElementById('retiroForm');
    try{
        retirarClienteBtn.addEventListener('click', toggleFormularioRetiro);
        eliminarBtn.addEventListener('click', function () {
            const confirm = window.confirm("¿Seguro que desea eliminar esta reparación del sistema? Es posible que sólo requieras cambiarle su estado.");
    
            if(!confirm){
                return;
            }
    
            fetch("/reparacion", {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: this.value })
            }).then(response => {
                if (response.ok) {
                    mostrarPopup('Producto eliminado con éxito.', false);
                    setTimeout(() => {
                        window.location.href = "/";
                    }, 2000)
    
                } else {
                    console.error('Error al eliminar el producto.', true);
                }
            })
                .catch(error => {
                    console.error('Error de red:', error);
                });
        });
    
        retiroForm.addEventListener('submit', event => {
            event.preventDefault();
            const radioButtons = document.getElementsByName('radius');
            let estado;
            for (const radioButton of radioButtons) {
                if (radioButton.checked) {
                    estado = radioButton.value;
                    break;
                }
            }
    
            // Obtener la URL actual
            const urlActual = window.location.href;
    
            // Crear un objeto URL a partir de la URL actual
            const url = new URL(urlActual);
    
            // Usar URLSearchParams para obtener el valor del parámetro 'id'
            const parametros = new URLSearchParams(url.search);
            const id_reparacion = parametros.get('id');
            
            formData = {
                estado,
                monto: document.getElementById('monto').value,
                medio_pago: document.getElementById('metodo-pago').value,
                tipo_factura: document.getElementById('tipo-factura').value,
            }
    
            if(! (formData.estado && formData.monto )) {
                alert("Formulario incompleto. Revise los campos.");
                return;
            }
    
    
            fetch("/factura", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })
            .then(async response => {
                if (!response.ok)
                    console.error('Error en la respuesta desde /factura');
                const data = await response.json();
                let body = { id: id_reparacion, factura_id: data.factura_id, estado: formData.estado };
                console.log("body enviandose a /reparacion: ", body);
                await fetch('/reparacion', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(body)
                })
                mostrarPopup("Factura creada con éxito.", false);
                setTimeout(() => location.reload(), 1500);
            })
            .catch(err => {
                console.error(err);
            })
        })
    } catch (e){
    }
    

}

document.addEventListener('DOMContentLoaded', main)