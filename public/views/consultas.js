function agregarFilaATabla(datosFila, tabla){
    const fila = document.createElement('tr');
    fila.innerHTML = `
    <td>${datosFila.dni}</td>
    <td>${datosFila.nombre}</td>
    <td>${datosFila.marca}</td>
    <td>${datosFila.modelo}</td>
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
                res.rows.forEach(fila => {
                    agregarFilaATabla(fila, tabla);
                })
            }
        }
        xhr.send();
    })
}

document.addEventListener('DOMContentLoaded', main)