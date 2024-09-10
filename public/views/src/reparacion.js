let reparacion = {};

import { fechaParser } from './utils.js';

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
    $('#main-info').removeClass('col-md-3');
}

const submitComment = comment => {
    if(!comment) return;

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
    .then(() => {
        $('#lista-comentarios')
            .append(`<li class="list-group-item text-muted p-5"><span class="fw-bolder">${fechaParser(fecha.toString())}</span> ${fecha.getHours().toString().padStart(2, '0')}:${fecha.getMinutes().toString().padStart(2, '0')}<br>
            <span class="fs-6">${comment}<span></li>`);
        
        $('#input-comentario').val('')
    })
    .catch(error => console.error(error));

}

const eventListeners = () => {
    $('#btn-comentario').on('click', event => {
        submitComment( $('#input-comentario').val() )
    });
    $('#input-comentario').on('keypress', event => {
        if(event.key === 'Enter') submitComment( $('#input-comentario').val() );
    });
}

/**
 * Coloca en el DOM los comentarios de la variable global "reparacion"
 */
const updateCommentSection = () => {
    const lista = document.getElementById('lista-comentarios');
    lista.innerHTML = '';
    
    if(reparacion.comentarios === null)
        return;
    
    reparacion.comentarios.forEach(comment => {
        const fecha = new Date(comment.fecha);
        lista.innerHTML += (`<li class="list-group-item text-muted"><span class="fw-bolder">${fechaParser(fecha.toString())}</span> ${fecha.getHours().toString().padStart(2, '0')}:${fecha.getMinutes().toString().padStart(2, '0')}<br>
            <span class="fs-6">${comment.texto}<span></li>`);
        
        $('#input-comentario').val('')
    })
}

/**
 * Busca en API comentarios de la reparación y los guarda en la variable global reparación.
 */
const loadComments = () => {
    return fetch('/api/comentarios/' + reparacion.id)
    .then(res => {
        console.log(res);
        return res.json()})
    .then(data => {
        reparacion.comentarios = data;
    })
    .catch(error => console.error(error));
}


function onLoad() {
    const urlParams = new URLSearchParams(window.location.search);
    const idReparacion = urlParams.get('id');

    fetch('/api/reparacion/' + idReparacion)
    .then(res => res.json())
    .then(data => {
        reparacion = data;
        setContent(reparacion);
    })
    .then(() => {
        eventListeners();
        return loadComments();
    })
    .then(() => {
        updateCommentSection();
    })
    .then(() => $('.card').removeClass('d-none'))
    .catch(e => {
        console.error(e);
    })
}

document.addEventListener('DOMContentLoaded', onLoad)