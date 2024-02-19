let dniCliente;

function mostrarInfoCliente(nodoPadre, nodoHijo, data) {
  nodoHijo.style.display = "flex";
  nodoHijo.style.alignItems = "center";
  nodoHijo.style.padding = '0 30px';
  nodoHijo.innerHTML = `<b>Nombre</b>: ${data.cliente.nombre.slice(0, 25)}`;
  nodoPadre.append(nodoHijo.cloneNode(true));
  nodoHijo.innerHTML = `<b>Tel</b>: ${data.cliente.telefono || 'Sin definir'}`;
  nodoPadre.append(nodoHijo.cloneNode(true));
}

function agregarCampos(){
  const form = document.getElementById('nombre-form');
  const campoNombre = document.createElement('label');
  campoNombre.setAttribute('class', 'third')
  campoNombre.innerHTML = `Nombre<input id="nombre-input" type="text" maxlength="50">`;

  const campoTelefono = document.createElement('label');
  campoTelefono.setAttribute('class', 'third');
  campoTelefono.innerHTML = `Telefono <input id="telefono-input" type="number" maxlength="12">`;

  form.appendChild(campoNombre);
  form.appendChild(campoTelefono);
}

function agregarCliente(cliente) {
  fetch('nuevareparacion/agregarcliente', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ cliente })
  })
    .then(response => {
      return response.json();
    })
    .catch(e => {
      console.error(e)
    })
}

const popupIngresarCliente = () => {
  agregarCampos();
  const formPopup = document.getElementById('cliente-form');
  formPopup.addEventListener('submit', event => {
    event.preventDefault();
    let nuevoCliente = {
      dni: dniCliente,
      nombre: document.getElementById('nombre-input') || false,
      telefono: document.getElementById('telefono-input') || false
    }
    agregarCliente(nuevoCliente);
  })
}

/* BUSQUEDA DE OPCIONES */

// Tipos de producto
fetch('/tipo-productos')
  .then(response => {
    if (!response.ok) {
      throw new Error('Error al obtener las opciones');
    }
    return response.json();
  })
  .then(data => {
    const datalist = document.getElementById('tipo-input');
    data.forEach(option => {
      const optionElement = document.createElement('option');
      optionElement.value = option.id;
      optionElement.text = option.descripcion;
      datalist.appendChild(optionElement);
    });
  })
  .catch(error => {
    console.error('Error:', error);
  });


// Fabricantes
fetch('/tipo-productos/fabricante')
  .then(response => {
    if (!response.ok) {
      throw new Error('Error al obtener las opciones');
    }
    return response.json();
  })
  .then(data => {
    const datalist = document.getElementById('fabricante-input');
    data.forEach(option => {
      const optionElement = document.createElement('option');
      optionElement.value = option.id;
      optionElement.text = option.descripcion;
      datalist.appendChild(optionElement);
    });
  })
  .catch(error => {
    console.error('Error:', error);
  });

/* PROCESAMIENTO DE DATOS DEL FORMULARIO */
document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('cliente-form').addEventListener('submit', event => {
    event.preventDefault();
    let dni = document.getElementById('dni-input');
    if(!dniCliente){
      dni.setAttribute('disabled', 'true');
      dniCliente = dni.value;
      fetch('/nuevareparacion/obtenercliente', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ dni: dniCliente })
      })
      .then(response => {
        return response.json();
      })
      .then(data => {
        let nodoPadre = document.getElementById('nombre-form');
        let nodoHijo = document.createElement('div');
        if(data.existe){
          // indicar que se encontro cliente, mostrar nombre y telefono (si existen)
          mostrarInfoCliente(nodoPadre, nodoHijo, data);
          const fieldsetProducto = document.getElementById('producto-fieldset');
          fieldsetProducto.removeAttribute('disabled');
        } else {
          // indicar que el cliente no existe y añadir los campos para rellenar con datos de nuevo cliente
          popupIngresarCliente();
        }
      })
      .catch(error => {
        console.error('Error al enviar la solicitud de cliente:', error);
      })
    } else {

    }
  })
  document.getElementById('producto-form').addEventListener('submit', function (event) {
    event.preventDefault(); // Evita que el formulario se envíe automáticamente

    // Obtiene los valores de los campos del formulario
    let tipo = document.getElementById('tipo-input').value;
    let fabricante = document.getElementById('fabricante-input').value;
    let modelo = document.getElementById('modelo-input').value;
    let falla = document.getElementById('falla-input').value;

    // Crea un objeto con los datos del formulario
    let formData = {
      dni: dniCliente,
      tipo,
      fabricante,
      modelo,
      falla,
    };

    // Realiza una solicitud POST al servidor Node.js
    fetch('/nuevareparacion', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        console.log('Respuesta del servidor:', data);
        // Hacer algo con la respuesta del servidor si es necesario
      })
      .catch(function (error) {
        console.error('Error al enviar la solicitud:', error);
      });
  });
});
