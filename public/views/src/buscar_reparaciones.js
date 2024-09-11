import { fechaParser } from './utils.js';

function dirigirAReparacion(id){
    window.open("/reparacion?id=" + id, "_blank");
}

function agregarFilaATabla(datosFila){
    const card = document.createElement('div');
    card.classList.add('card-body', 'shadow-sm', 'border', 'rounded-4', 'px-4', 'py-3', 'my-1', 'hover-fila');
    //card.setAttribute('onclick', `dirigirAReparacion(${datosFila.id});`);
    card.addEventListener('click', () => window.location.href = '/reparacion?id=' + datosFila.id);
    card.addEventListener('mousedown', event => { if(event.button === 1) dirigirAReparacion(datosFila.id)} )

    const repView = document.createElement('rep-view');

    repView.setAttribute('data-id', datosFila.id);
    repView.setAttribute('estado', datosFila.estado);
    repView.setAttribute('fabricante', datosFila.fabricante.descripcion);
    repView.setAttribute('modelo', datosFila.modelo_electro);
    repView.setAttribute('nombre-cliente', datosFila.cliente.nombre);
    repView.setAttribute('telefono-cliente', datosFila.cliente.telefono);
    repView.setAttribute('fecha-recepcion', fechaParser(datosFila.fecha_recepcion));
    repView.setAttribute('desc-falla', datosFila.desc_falla);
    
    card.appendChild(repView);
    
    const mainDiv = document.getElementById('results');
    mainDiv.appendChild(card)
}

const filtros = [null, null, null, null];

const includedInFilter = rep => {
    const estado = rep.estado;
    return (
        (filtros[0] && estado == 'pendiente') ||
        (filtros[1] && estado == 'en revision') ||
        (filtros[2] && estado == 'reparado') ||
        (filtros[3] && estado == 'sin arreglo')
    )
}

const actualizarFiltros = () => {
    filtros[0] = document.getElementById('chk-pendientes')?.checked;
    filtros[1] = document.getElementById('chk-en-revision')?.checked;
    filtros[2] = document.getElementById('chk-reparado')?.checked;
    filtros[3] = document.getElementById('chk-sin-arreglo')?.checked;
}

const busqueda = event => {
    actualizarFiltros();
    
    if(event)
        event.preventDefault();

    const searchTerm = document.getElementById('search').value;
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';
    document.getElementById('loading-spinner').style.visibility = 'visible';

    
    
    let url;
    if(searchTerm)
        url = '/api/buscar?search=' + encodeURIComponent(searchTerm);
    else
        url = '/api/buscar';



    fetch(url)
        .then(res => res.json())
        .then(data => {
            if(data.length)
                data.forEach(rep => {
                    if(includedInFilter(rep))
                        agregarFilaATabla(rep);
                })
            else {
                
            }
        })
        .catch(err => {
            console.error(err);
            const errorPopup =  document.getElementById('errorPopup');
            errorPopup.innerHTML = `<i class="fa fa-exclamation-triangle" aria-hidden="true"></i> Se ha producido un error: ${err}`
            errorPopup.classList.add('show')
            setTimeout(() => {
                errorPopup.classList.remove('show');
            }, 5000)
        })
        .finally(() => {
            document.getElementById('loading-spinner').style.visibility = 'hidden'
        })
}

function onLoad (){
    const form = document.getElementById('search-form');
    form.addEventListener('submit', busqueda);
    busqueda();
}

document.addEventListener('DOMContentLoaded', onLoad)