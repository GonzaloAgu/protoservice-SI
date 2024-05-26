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
    const retiroForm = document.getElementById('formulario-retiro');

    if( retiroForm.style.display === 'none')
        retiroForm.style.display = 'block';
    else
        retiroForm.style.display = 'none'
}

function main() {
    const retirarClienteBtn = document.getElementById("retiro-btn")
    const eliminarBtn = document.getElementById('eliminar-btn');
    const retiroForm = document.getElementById('formulario-retiro');
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
                mostrarPopup('Producto eliminado con éxito.');
                setTimeout(() => {
                    window.location.href = "/";
                }, 2000)

            } else {
                console.error('Error al eliminar el producto.');
            }
        })
            .catch(error => {
                console.error('Error de red:', error);
            });
    });
}

document.addEventListener('DOMContentLoaded', main)