function mostrarPopup(mensaje) {
    const popup = document.getElementById("successPopup");
    popup.classList.add('show');
    setTimeout(() => {
        popup.classList.remove('show')
    }, 5000);
}

function actualizarEstado() {
    const parametros = new URLSearchParams(window.location.search);
    const id = parametros.get("id");

    fetch("/actualizarestado", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ estado: document.getElementById("estado-select").value, id: id })
    })
        .then(response => {
            if (response.ok) {
                mostrarPopup("Estado de reparación cambiado correctamente.");
            }
        })
        .catch(e => {
            alert("Error: ", e)
        })
}


function main() {
    const retirarClienteBtn = document.getElementById("retiro-btn")
    const eliminarBtn = document.getElementById('eliminar-btn');
    const reparadoForm = document.getElementById('reparado-form');

    retirarClienteBtn.addEventListener('click', function () {
        // Aquí puedes implementar la lógica para abrir el formulario de retiro de cliente
        reparadoForm.style.display = 'block';
    });

    eliminarBtn.addEventListener('click', function () {
        fetch("/reparacion", {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: this.value })
        }).then(response => {
            if (response.ok) {
                alert('Producto eliminado con éxito.');
                setTimeout(() => {
                    window.location.href = "/";
                }, 500)

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