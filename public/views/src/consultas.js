function dirigirAReparacion(id){
    window.location.href = "/reparacion?id=" + id;
}

function agregarFilaATabla(datosFila, tabla){
    const fila = document.createElement('tr');
    fila.setAttribute('onclick', `dirigirAReparacion(${datosFila.id})`)
    fila.setAttribute('class', 'hover-fila')
    fila.innerHTML = `
    <td>${datosFila.dni}</td>
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

        const url = '/buscar?search=' + encodeURIComponent(searchTerm);

        const xhr = new XMLHttpRequest();

        xhr.open('GET', url, true);
        xhr.onload = () => {
            if(xhr.readyState == 4 && xhr.status == 200) {
                res = JSON.parse(xhr.responseText);
                const tabla = document.getElementById('tabla-resultados')
                tabla.innerHTML = '';
                if(res.length)
                    res.forEach(fila => {
                        agregarFilaATabla(fila, tabla);
                    })
                else {
                    const fila = document.createElement('td');
                    fila.setAttribute('colspan', 6);
                    fila.style['text-align'] = 'center';
                    fila.innerHTML = "No se encontraron resultados.";
                    tabla.appendChild(fila);
                }
            }
        }
        xhr.send();
    })
}

document.addEventListener('DOMContentLoaded', main)