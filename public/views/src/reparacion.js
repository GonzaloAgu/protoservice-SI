let reparacion = {};
const estados = ['pendiente', 'en revision', 'reparado', 'sin arreglo'];


import { fechaParser, badgeColors } from './utils.js';
import { handleGenerarPdfBtn } from '../../pdf/factura_logic.js';

const updateBadge = (estado) => {
    const posicion = badgeColors.findIndex(item => item.estado === estado);
    const estadoElement = document.querySelector('#estado');
    estadoElement.textContent = estado;

    estadoElement.classList.forEach(className => {
        if (className.match(/\b(bg-\w+)/)) {
            estadoElement.classList.remove(className);
        }
    });

    estadoElement.classList.add(badgeColors[posicion].class)
}

const setContent = rep => {
    $('#nro-reparacion').text(rep.id);
    $('#nro-reparacion-title').text(rep.id);
    $('#fabricante').text(rep.fabricanteObj.descripcion + ' ');
    $('#modelo').text(rep.modelo_electro);
    updateBadge(rep.estado)

    $('#nombre-cliente').text(rep.clienteObj.nombre);
    $('#whatsapp').attr('href', 'https://wa.me/54' + rep.clienteObj.telefono);
    $('#telefono-cliente').text(rep.clienteObj.telefono);
    $('#descripcion-falla').text(rep.desc_falla);
    $('#fecha-recepcion').text(fechaParser(rep.fecha_recepcion));
    $('#main-info').removeClass('col-md-3');
}

const submitComment = comment => {
    if (!comment) return;

    const fecha = new Date();

    const body = {
        texto: comment,
        id_reparacion: reparacion.id
    }

    fetch('/api/comentario', {
        method: 'POST',
        headers: {
            'Content-Type': "application/json"
        },
        body: JSON.stringify(body)
    })
        .then(res => res.json)
        .then(loadComments)
        .then(updateCommentSection)
        .catch(error => showError(error.message));

}

const showError = (message) => {
    $('#errorPopup').addClass('show').text('Error: ' + message);
    setTimeout(() => {
        $('#errorPopup').removeClass('show')
    }, 3000)
}

const actualizarEstado = () => {
    const selected = $('input[name="estado"]:checked').val();
    fetch('/api/reparacion', {
        method: 'PATCH',
        headers: {
            "Content-Type": 'application/json'
        },
        body: JSON.stringify({ id: reparacion.id, estado: estados[Number(selected)] })
    })
        .then(res => res.json)
        .then(data => {
            updateBadge(estados[selected])
        })
        .catch(error => {
            showError(error.message)
        })
}

const eventListeners = () => {
    $('#btn-comentario').on('click', event => {
        submitComment($('#input-comentario').val())
    });
    $('#input-comentario').on('keypress', event => {
        if (event.key === 'Enter') submitComment($('#input-comentario').val());
    });
    $('.dropdown-menu').on('click', (event) => {
        if (!$(event.target).closest('button').length) {
            event.stopPropagation();
        }
    });

    $('#btn-actualizar-estado').on('click', () => actualizarEstado())
    $('#btn-eliminar-confirmado').on('click', eliminarReparacion);
    $('#btn-generar-pdf').on('click', handleGenerarPdfBtn)

}

/**
 * Coloca en el DOM los comentarios de la variable global "reparacion"
 */
const updateCommentSection = () => {
    const lista = document.getElementById('lista-comentarios');
    lista.innerHTML = '';

    if (reparacion.comentarios === null)
        return;

    reparacion.comentarios.forEach(comment => {
        const fecha = new Date(comment.fecha);
        lista.innerHTML += (`<li class="list-group-item text-muted px-2"><span class="fw-bolder">${fechaParser(fecha.toString())}</span> ${fecha.getHours().toString().padStart(2, '0')}:${fecha.getMinutes().toString().padStart(2, '0')}<br>
            <span class="fs-6">${comment.texto}<span></li>`);

        $('#input-comentario').val('')
    })
}

/**
 * Busca en API comentarios de la reparación y los guarda en la variable global reparación.
 */
const loadComments = () => {
    return fetch('/api/comentarios/' + reparacion.id)
        .then(res => res.json())
        .then(data => {
            reparacion.comentarios = data;
        })
        .catch(error => showError(error.message));
}


const eliminarReparacion = () => {
    $('.card').addClass('d-none');
    $('#spinner-container').removeClass('d-none');
    
    fetch('api/reparacion', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: reparacion.id })
    })
    .then(res => res.json())
    .then(data => window.location.href = '/consulta')
    .catch(error => showError(error.message))
    
}

function onLoad() {
    const urlParams = new URLSearchParams(window.location.search);
    const idReparacion = urlParams.get('id');

    document.title = `Reparacion #${idReparacion} - Electroservice`

    fetch('/api/reparacion/' + idReparacion)
        .then(res => res.json())
        .then(data => {
            reparacion = data;
            document.querySelector('#rep-view').setAttribute('estado', reparacion.estado);
            setContent(reparacion);
        })
        .then(() => {
            eventListeners();
            return loadComments();
        })
        .then(() => {
            updateCommentSection();
        })
        .catch(e => {
            $('.card').html(`<h2>Error 404: No se encontró la reparación</h2>`)
            showError(error.message);
        })
        .finally(() => $('.card').removeClass('d-none'))
}



document.addEventListener('DOMContentLoaded', onLoad)