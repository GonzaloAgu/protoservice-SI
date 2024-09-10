function dirigirAReparacion(id){
    window.open("/reparacion?id=" + id, "_blank");
}

function agregarFilaATabla(datosFila){
    const card = document.createElement('div');
    card.classList.add('card-body', 'shadow-sm', 'border', 'rounded-4', 'px-4', 'py-3', 'my-1', 'hover-fila');
    card.setAttribute('onclick', `dirigirAReparacion(${datosFila.id})`);

    const repView = document.createElement('rep-view');
    repView.classList.replace('justify-content-between', 'justify-content-around')

    repView.setAttribute('data-id', datosFila.id);
    repView.setAttribute('estado', datosFila.estado);
    repView.setAttribute('fabricante', datosFila.fabricante.descripcion);
    repView.setAttribute('modelo', datosFila.modelo_electro);
    repView.setAttribute('nombre-cliente', datosFila.cliente.nombre);
    repView.setAttribute('telefono-cliente', datosFila.cliente.telefono);
    repView.setAttribute('fecha-recepcion', '04/09/2024');
    repView.setAttribute('desc-falla', datosFila.desc_falla);
    
    card.appendChild(repView);
    
    const mainDiv = document.getElementById('results');
    mainDiv.appendChild(card)


   /*  const fila = document.createElement('tr');
    fila.setAttribute('onclick', `dirigirAReparacion(${datosFila.id})`)
    fila.setAttribute('class', 'hover-fila')
    fila.innerHTML = `
    <td>${datosFila.cliente.nombre}</td>
    <td>${datosFila.fabricante.descripcion} ${datosFila.modelo_electro}</td>
    <td>${datosFila.desc_falla}</td>
    <td>${datosFila.fecha_recepcion.slice(0,10)}</td>
    <td>${datosFila.estado}</td>
    `;
    tabla.appendChild(fila); */
}

function main (){
    const form = document.getElementById('search-form');
    let searchInput = document.getElementById('search');

    form.addEventListener('submit', event => {
        event.preventDefault();
        const searchTerm = searchInput.value;
        const resultsDiv = document.getElementById('results');
        resultsDiv.innerHTML = '';
        document.getElementById('loading-spinner').style.display = 'inline-block';

        let url;
        if(searchTerm)
            url = '/api/buscar?search=' + encodeURIComponent(searchTerm);
        else
            url = '/api/buscar';

        fetch(url)
            .then(res => res.json())
            .then(data => {
                if(data.length)
                    data.forEach(fila => {
                        agregarFilaATabla(fila);
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
                document.getElementById('loading-spinner').style.display = 'none'
            })
    })
}

document.addEventListener('DOMContentLoaded', main)