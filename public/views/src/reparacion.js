let reparacion = {};

const fechaParser = fechaStr => {
    const fecha = new Date(fechaStr);

    const dia = String(fecha.getUTCDate()).padStart(2, '0');
    const mes = String(fecha.getUTCMonth() + 1).padStart(2, '0');
    const anio = fecha.getUTCFullYear();

    return `${dia}/${mes}/${anio}`;
}

const setContent = rep => {
    $('#nro-reparacion').text(rep.id);
    $('#fabricante').text(rep.fabricanteObj.descripcion + ' ');
    $('#modelo').text(rep.modelo_electro);
    $('#estado').text(rep.estado);
    $('#nombre-cliente').text(rep.clienteObj.nombre);
    $('#whatsapp').attr('href', 'https://wa.me/54' + rep.clienteObj.telefono);
    $('#telefono-cliente').text(rep.clienteObj.telefono);
    $('#descripcion-falla').text(rep.desc_falla);
    $('#fecha-recepcion').text(fechaParser(rep.fecha_recepcion));
}

const submitComment = comment => {
    if(!comment) return;

    const fecha = new Date();
    $('#lista-comentarios')
        .append(`<li class="list-group-item text-muted"><span class="fw-bolder">${fechaParser(fecha.toString())}</span> ${fecha.getHours().toString().padStart(2, '0')}:${fecha.getMinutes().toString().padStart(2, '0')}<br>
        ${comment}</li>`);
    
    $('#input-comentario').val('')
}

const eventListeners = () => {
    $('#btn-comentario').on('click', event => {
        submitComment( $('#input-comentario').val() )
    });
    $('#input-comentario').on('keypress', event => {
        if(event.key === 'Enter') submitComment( $('#input-comentario').val() );
    });
}


function onLoad() {
    const urlParams = new URLSearchParams(window.location.search);
    const idCliente = urlParams.get('id');

    fetch('/api/reparacion/' + idCliente)
    .then(res => res.json())
    .then(data => {
        reparacion = data;
        setContent(reparacion);
    })
    .then(() => $('.card').removeClass('d-none'))
    .catch(e => {
        console.error(e);
    })

    eventListeners();
    
}

document.addEventListener('DOMContentLoaded', onLoad)