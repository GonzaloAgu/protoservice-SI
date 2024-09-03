function dirigirAReparacion(id){
    window.location.href = "/reparacion?id=" + id;
}

function agregarFilaATabla(datosFila, tabla){
    const fila = document.createElement('tr');
    fila.setAttribute('onclick', `dirigirAReparacion(${datosFila.id})`)
    fila.setAttribute('class', 'hover-fila')
    fila.innerHTML = `
    <td>${datosFila.nombre}</td>
    <td>${datosFila.marca} ${datosFila.modelo}</td>
    <td>${datosFila.fecha_recepcion.slice(0,10)}</td>
    <td>${datosFila.desc_falla}</td>
    <td>${datosFila.estado}</td>
    `;
    tabla.appendChild(fila);
}

function main (){
    const form = document.getElementById('search-form');
    let searchInput = document.getElementById('search');

    form.addEventListener('submit', event => {
        event.preventDefault();

        const searchTerm = searchInput.value;

        let url;
        if(searchTerm)
            url = '/api/buscar?search=' + encodeURIComponent(searchTerm);
        else
            url = '/api/buscar';

        fetch(url)
            .then(res => res.json())
            .then(data => {
                const tabla = document.getElementById('tabla-resultados')
                tabla.innerHTML = '';
                if(data.length)
                    data.forEach(fila => {
                        agregarFilaATabla(fila, tabla);
                    })
                else {
                    const fila = document.createElement('td');
                    fila.setAttribute('colspan', 6);
                    fila.style['text-align'] = 'center';
                    fila.innerHTML = "No se encontraron resultados.";
                    tabla.appendChild(fila);
                }
            })
            .catch(err => console.error(err));
    })
}

document.addEventListener('DOMContentLoaded', main)